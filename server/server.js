/* ============================================================
   Od. Pabla María Bonaudi — Backend del sitio
   Servidor sin dependencias (Node.js puro).
   - Sirve los archivos estáticos de /public
   - API de disponibilidad y reservas de turnos
   - Panel de administración protegido por contraseña
   Almacenamiento: archivo JSON en /data/appointments.json
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
// Si no se define ADMIN_PASSWORD, se genera una aleatoria y se muestra por consola al iniciar.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
const GENERATED_PASSWORD = !process.env.ADMIN_PASSWORD;

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = ROOT; // GitHub Pages sirve la raíz del repo
const DATA_FILE = path.join(ROOT, 'data', 'appointments.json');
// Archivos que nunca se sirven públicamente
const STATIC_BLOCKLIST = ['/server/', '/data/', '/.git', '/.gitignore', '/readme.md', '/package.json'];

const WA_NUMBER = '5493512166540'; // 54 9 351 2166540 (formato wa.me)

/* ---------- utilidades ---------- */
const pad = (n) => String(n).padStart(2, '0');

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) { reject(new Error('Payload too large')); req.destroy(); }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

function loadAppointments() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}

function saveAppointments(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function isValidDateStr(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T12:00:00');
  return !isNaN(d.getTime());
}

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/* Horario de atención:
   Lun–Vie: 09:00–18:30 (turnos de 30 min)
   Sábado:  09:00–12:30
   Domingo: cerrado */
function slotsForDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay(); // 0 = domingo
  if (day === 0) return { open: false, reason: 'Los domingos el consultorio está cerrado.', slots: [] };
  const endHour = day === 6 ? 13 : 19;
  const slots = [];
  for (let h = 9; h < endHour; h++) {
    slots.push(`${pad(h)}:00`, `${pad(h)}:30`);
  }
  return { open: true, slots };
}

const SERVICES = {
  odontologia: [
    'Limpieza y profilaxis dental',
    'Blanqueamiento dental',
    'Carillas de porcelana y composite',
    'Diseño de sonrisa',
    'Ortodoncia y alineadores',
    'Implantes dentales',
    'Endodoncia (tratamiento de conducto)',
    'Periodoncia y encías',
  ],
  armonizacion: [
    'Toxina botulínica (arrugas de expresión)',
    'Relleno de labios con ácido hialurónico',
    'Voluminización facial (pómulos, mentón, ojeras)',
    'Bioestimuladores de colágeno',
    'Rinomodelación',
    'Hilos tensores / lifting sin cirugía',
    'Peelings químicos',
    'Mesoterapia y skinbooster',
  ],
};
const ALL_SERVICES = [...SERVICES.odontologia, ...SERVICES.armonizacion];

/* Rate limit simple para el formulario de reservas */
const rateBuckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const bucket = (rateBuckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (bucket.length >= 20) { rateBuckets.set(ip, bucket); return true; }
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return false;
}

/* Sesiones de administración (en memoria, expiran a las 12 h) */
const adminTokens = new Map();
function createToken() {
  const token = crypto.randomBytes(24).toString('hex');
  adminTokens.set(token, Date.now() + 12 * 60 * 60 * 1000);
  return token;
}
function isAuthorized(req) {
  const token = (req.headers['x-admin-token'] || '').trim();
  const exp = adminTokens.get(token);
  if (!exp) return false;
  if (Date.now() > exp) { adminTokens.delete(token); return false; }
  return true;
}

/* ---------- API ---------- */
async function handleApi(req, res, url) {
  const route = url.pathname;

  // Disponibilidad de un día
  if (route === '/api/availability' && req.method === 'GET') {
    const date = url.searchParams.get('date');
    if (!isValidDateStr(date)) return sendJson(res, 400, { error: 'Fecha inválida.' });
    if (date < todayStr()) return sendJson(res, 400, { error: 'La fecha no puede ser anterior a hoy.' });
    const { open, reason, slots } = slotsForDate(date);
    const taken = new Set(
      loadAppointments()
        .filter((a) => a.date === date && a.status !== 'cancelado')
        .map((a) => a.time)
    );
    return sendJson(res, 200, {
      open,
      reason: reason || null,
      slots: slots.map((t) => ({ time: t, taken: taken.has(t) })),
    });
  }

  // Crear reserva
  if (route === '/api/appointments' && req.method === 'POST') {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (rateLimited(ip)) return sendJson(res, 429, { error: 'Demasiadas solicitudes. Probá de nuevo en unos minutos.' });

    let body;
    try { body = await readBody(req); } catch { return sendJson(res, 400, { error: 'JSON inválido.' }); }

    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const area = String(body.area || '').trim();
    const treatment = String(body.treatment || '').trim();
    const date = String(body.date || '').trim();
    const time = String(body.time || '').trim();
    const notes = String(body.notes || '').trim().slice(0, 500);

    if (name.length < 3) return sendJson(res, 400, { error: 'Ingresá tu nombre y apellido.' });
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return sendJson(res, 400, { error: 'Ingresá un teléfono válido (ej.: 351 216 6540).' });
    if (!SERVICES[area]) return sendJson(res, 400, { error: 'Elegí un área válida.' });
    if (!ALL_SERVICES.includes(treatment)) return sendJson(res, 400, { error: 'Elegí un tratamiento válido.' });
    if (!isValidDateStr(date)) return sendJson(res, 400, { error: 'Elegí una fecha válida.' });
    if (date < todayStr()) return sendJson(res, 400, { error: 'La fecha no puede ser anterior a hoy.' });

    const { open, slots } = slotsForDate(date);
    if (!open) return sendJson(res, 400, { error: 'Ese día el consultorio está cerrado.' });
    if (!slots.includes(time)) return sendJson(res, 400, { error: 'Horario inválido para ese día.' });

    const list = loadAppointments();
    const clash = list.find((a) => a.date === date && a.time === time && a.status !== 'cancelado');
    if (clash) return sendJson(res, 409, { error: 'Ese horario acaba de ser reservado. Elegí otro, por favor.' });

    const appointment = {
      id: crypto.randomUUID(),
      name,
      phone,
      area,
      treatment,
      date,
      time,
      notes,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    list.push(appointment);
    saveAppointments(list);
    return sendJson(res, 201, { ok: true, appointment });
  }

  // Login de la profesional
  if (route === '/api/admin/login' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch { return sendJson(res, 400, { error: 'JSON inválido.' }); }
    if (String(body.password || '') !== ADMIN_PASSWORD) {
      return sendJson(res, 401, { error: 'Contraseña incorrecta.' });
    }
    return sendJson(res, 200, { ok: true, token: createToken() });
  }

  // Rutas protegidas del panel
  if (route.startsWith('/api/admin/')) {
    if (!isAuthorized(req)) return sendJson(res, 401, { error: 'No autorizado.' });

    if (route === '/api/admin/appointments' && req.method === 'GET') {
      const list = loadAppointments()
        .slice()
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      return sendJson(res, 200, { appointments: list });
    }

    const match = route.match(/^\/api\/admin\/appointments\/([A-Za-z0-9-]+)$/);
    if (match && req.method === 'PATCH') {
      let body;
      try { body = await readBody(req); } catch { return sendJson(res, 400, { error: 'JSON inválido.' }); }
      const status = String(body.status || '');
      if (!['pendiente', 'confirmado', 'cancelado'].includes(status)) {
        return sendJson(res, 400, { error: 'Estado inválido.' });
      }
      const list = loadAppointments();
      const item = list.find((a) => a.id === match[1]);
      if (!item) return sendJson(res, 404, { error: 'Turno no encontrado.' });
      item.status = status;
      saveAppointments(list);
      return sendJson(res, 200, { ok: true, appointment: item });
    }

    if (match && req.method === 'DELETE') {
      const list = loadAppointments();
      const next = list.filter((a) => a.id !== match[1]);
      if (next.length === list.length) return sendJson(res, 404, { error: 'Turno no encontrado.' });
      saveAppointments(next);
      return sendJson(res, 200, { ok: true });
    }
  }

  return sendJson(res, 404, { error: 'Ruta no encontrada.' });
}

/* ---------- archivos estáticos ---------- */
function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/admin') pathname = '/admin.html';

  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  const rel = '/' + path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/').toLowerCase();
  if (STATIC_BLOCKLIST.some((b) => rel === b.replace(/\/$/, '') || rel.startsWith(b))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1 style="font-family:Georgia">404 — Página no encontrada</h1>');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(content);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405); res.end('Method not allowed'); return;
    }
    return serveStatic(req, res, url);
  } catch (err) {
    console.error('Error:', err);
    sendJson(res, 500, { error: 'Error interno del servidor.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Sitio Od. Pabla Bonaudi corriendo en http://${HOST}:${PORT}`);
  if (GENERATED_PASSWORD) {
    console.log(`🔑 ADMIN_PASSWORD no definida. Contraseña del panel generada: ${ADMIN_PASSWORD}`);
    console.log('   Definí ADMIN_PASSWORD para usar tu propia contraseña.');
  }
});
