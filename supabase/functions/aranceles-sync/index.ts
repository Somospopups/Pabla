// Supabase Edge Function: aranceles-sync
// Baja el PDF de aranceles vigente del Colegio Odontológico de Córdoba,
// lo parsea y reemplaza la lista oficial del panel.
// Si algo falla, NO toca nada: se sigue viendo la versión anterior.
//
// Llamada desde el panel (botón "Actualizar ahora") con el token de la
// usuaria logueada. Requiere las tablas official_aranceles y
// official_aranceles_meta (ver ARANCELES-P1-CREAR-TABLAS.sql o el SQL
// embebido en el panel).

import { extractText } from 'npm:unpdf@0.12.1';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const PAGINA = 'https://colodontcba.org.ar/informacion-general/aranceles/';
const UA = 'Mozilla/5.0 (compatible; PablaBonaudiPanel/1.0)';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (status: number, obj: unknown) =>
  new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/* ---------- parser del nomenclador (validado contra el PDF de Agosto 2026) ---------- */
const CAPITULOS: Record<number, string> = {
  1: 'CONSULTAS', 2: 'OPERATORIA', 3: 'ENDODONCIA', 4: 'PRÓTESIS', 5: 'PREVENCIÓN',
  6: 'ORTODONCIA', 7: 'ODONTOPEDIATRÍA', 8: 'PERIODONCIA', 9: 'RADIOLOGÍA',
  10: 'CIRUGÍA', 11: 'IMPLANTOLOGÍA BUCAL', 12: 'PRESTACIONES VARIAS',
  13: 'PERSONAS CON DISCAPACIDAD', 14: 'ESTOMATOLOGÍA',
};

function limpiarTexto(t: string): string {
  t = t.replace(/gra\ufffdas\b/g, 'grafías').replace(/gra\ufffda\b/g, 'grafía');
  t = t.replace(/proté\ufffdcos/g, 'protésicos');
  t = t.replace(/\ufffd/g, 'ti'); // el resto son ligaduras "ti" de la itálica
  t = t.replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl');
  // 1208 garbled por solapamiento de columnas: solo se conserva el Total Arancel
  t = t.replace(/^1208 .*$/gm, '1208 Tratamiento de Síndrome temporo-mandibular (no incluye consulta de estudio ni controles posteriores) $ 844.655');
  return t;
}

function capituloDe(codigo: string): number | null {
  const lead = codigo.split('.')[0];
  if (codigo.includes('.') || lead.length >= 4) {
    const p2 = Number(lead.slice(0, 2));
    if (p2 >= 10 && p2 <= 14) return p2;
  }
  const d = Number(lead[0]);
  return d >= 1 && d <= 9 ? d : null;
}

type FilaArancel = {
  codigo: string; practica: string; total_cents: number | null;
  capitulo: number; capitulo_nombre: string; nota: string | null;
};

function parsearAranceles(textoPlano: string): FilaArancel[] {
  const t = limpiarTexto(textoPlano);
  const lines = t.split(/\r?\n/).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const rows: FilaArancel[] = [];
  for (const line of lines) {
    if (/^(CAPITULO|PRÁCTICA|Costo|Total Arancel|Honorario|Los Valores|Fuente|Valores de ref|A CONVENIR$|MOD|Grado|Módulo)/i.test(line)) continue;
    if (/^[12]° Ayudante/i.test(line)) continue;
    const m = line.match(/^(\d[\d.]{1,7})\s+(.+)$/);
    if (!m) continue;
    let codigo = m[1].replace(/\.$/, '');
    if (codigo.replace(/\./g, '').length < 3) continue;
    const resto = m[2];
    const cap = capituloDe(codigo);
    if (cap == null) continue;
    // montos: números con formato de miles argentino ($ 16.106 o 526.237$);
    // se ignoran marcas de nota al pie (*1, **) y el código (ya separado)
    const restoSinNotas = resto.replace(/\*+[0-9]{0,2}/g, ' ');
    const montos: number[] = [];
    const reNum = /\d{1,3}(?:\.\d{3})+|\d{4,7}/g;
    let mm: RegExpExecArray | null;
    while ((mm = reNum.exec(restoSinNotas))) {
      const n = parseInt(mm[0].replace(/\./g, ''), 10);
      if (Number.isFinite(n) && n >= 100 && n <= 100000000) montos.push(n);
    }
    // descripción = antes del primer "$" o del primer monto seguido de "$"
    let desc = resto;
    const idxDollar = desc.search(/\$/);
    const idxTrailing = desc.search(/\d{1,3}(?:\.\d{3})+(?=\s*\$)/);
    let idx = -1;
    if (idxDollar >= 0 && (idxTrailing < 0 || idxDollar <= idxTrailing)) idx = idxDollar;
    else if (idxTrailing >= 0) idx = idxTrailing;
    if (idx >= 0) desc = desc.slice(0, idx);
    desc = desc.replace(/\s+/g, ' ').replace(/[\s.\-–—*$]+$/, '').replace(/\s+A CONVENIR\s*$/i, '').trim();
    if (desc.length < 4 || !/[A-Za-záéíóúñ]{3}/i.test(desc)) continue;
    const notaM = /A CONVENIR/i.test(resto);
    const totalPesos = montos.length ? montos[montos.length - 1] : null;
    rows.push({
      codigo,
      practica: desc,
      total_cents: totalPesos == null ? null : totalPesos * 100,
      capitulo: cap,
      capitulo_nombre: CAPITULOS[cap] || '',
      nota: totalPesos == null ? (notaM ? 'A convenir' : 'Sin valor publicado') : null,
    });
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'Usá POST.' });
  try {
    const auth = req.headers.get('Authorization') || '';
    if (!auth.startsWith('Bearer ')) return json(401, { error: 'Falta autenticación.' });
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !anon) return json(500, { error: 'Faltan variables del proyecto (SUPABASE_URL / SUPABASE_ANON_KEY).' });

    // 0) solo la cuenta logueada del panel puede sincronizar
    const sb = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: userData, error: userErr } = await sb.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: 'Sesión inválida. Volvé a entrar al panel.' });

    // 1) página de aranceles → PDF más reciente por número de actualización
    const pageRes = await fetch(PAGINA, { headers: { 'user-agent': UA } });
    if (!pageRes.ok) return json(502, { error: `No se pudo abrir la página del Colegio (HTTP ${pageRes.status}).` });
    const html = await pageRes.text();
    let pdfUrl: string | null = null;
    let maxN = -1;
    const re = /href=["']([^"']*ARANCELES-GENERALES-(\d+)\.pdf[^"']*)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const n = parseInt(m[2], 10);
      if (n > maxN) { maxN = n; pdfUrl = m[1]; }
    }
    if (!pdfUrl || maxN < 0) return json(502, { error: 'No encontré el PDF de aranceles en la página del Colegio.' });
    pdfUrl = new URL(pdfUrl, PAGINA).toString();

    // 2) bajar el PDF
    const pdfRes = await fetch(pdfUrl, { headers: { 'user-agent': UA } });
    if (!pdfRes.ok) return json(502, { error: `No se pudo bajar el PDF (HTTP ${pdfRes.status}).` });
    const bytes = new Uint8Array(await pdfRes.arrayBuffer());
    if (bytes.length < 100000) return json(502, { error: 'El PDF bajado es sospechosamente chico; no lo toco.' });

    // 3) extraer texto
    let pages: string[] = [];
    try {
      const out: any = await extractText(bytes, { mergePages: false });
      pages = Array.isArray(out?.text) ? out.text : [String(out?.text ?? '')];
    } catch (_e) {
      return json(502, { error: 'No pude leer el PDF (el formato cambió). Seguís con la versión anterior.' });
    }

    // 4) vigencia: mes + año en la portada
    const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const portada = pages[0] || '';
    let vigencia: string | null = null;
    const mv = portada.match(/(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(20\d{2})/i);
    if (mv) vigencia = mv[1][0].toUpperCase() + mv[1].slice(1).toLowerCase() + ' ' + mv[2];
    if (!vigencia) vigencia = `Actualización ${maxN}`;

    // 5) parsear; validar antes de tocar la base
    const rows = parsearAranceles(pages.join('\n'));
    if (rows.length < 150 || !rows.some((r) => r.codigo === '101') || !rows.some((r) => r.codigo === '1001')) {
      return json(422, { error: `El PDF se leyó pero el formato no coincide (encontré ${rows.length} prácticas). No toqué nada; seguís con la versión anterior.` });
    }

    // 6) upsert de la lista nueva y limpieza de códigos que ya no existen
    const up = await fetch(`${url}/rest/v1/official_aranceles`, {
      method: 'POST',
      headers: { apikey: anon, Authorization: auth, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    });
    if (!up.ok) return json(500, { error: `No se pudo guardar la lista nueva (HTTP ${up.status}). No se perdió nada: seguís con la versión anterior.` });
    const codigos = rows.map((r) => encodeURIComponent(r.codigo)).join(',');
    let limpieza = true;
    const del = await fetch(`${url}/rest/v1/official_aranceles?codigo=not.in.(${codigos})`, {
      method: 'DELETE',
      headers: { apikey: anon, Authorization: auth, Prefer: 'return=minimal' },
    });
    if (!del.ok) limpieza = false; // no fatal: pueden quedar códigos viejos de más

    const meta = await fetch(`${url}/rest/v1/official_aranceles_meta?on_conflict=id`, {
      method: 'POST',
      headers: { apikey: anon, Authorization: auth, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify([{ id: 1, vigencia, pdf_url: pdfUrl, pagina_url: PAGINA, actualizado_en: new Date().toISOString() }]),
    });
    if (!meta.ok) return json(500, { error: 'La lista se guardó, pero no pude guardar la vigencia. Reintentá “Actualizar ahora”.' });

    return json(200, { ok: true, vigencia, filas: rows.length, conValor: rows.filter((r) => r.total_cents != null).length, pdf_url: pdfUrl, limpieza });
  } catch (e: any) {
    console.error(e);
    return json(500, { error: 'Error inesperado: ' + (e?.message || String(e)) });
  }
});
