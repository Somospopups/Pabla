/* ============================================================
   Od. Pabla María Bonaudi — Lógica del sitio
   ============================================================ */
'use strict';

const WA_NUMBER = '5493512166540';

/* ---------- Iconos SVG (trazo) ---------- */
const ICONS = {
  limpieza: '<path d="M12 5.5c-2.5-2-6-1.6-7.5.8-1.3 2-.7 5 .8 8 1.2 2.4 1.9 4.7 3.7 4.7 1.6 0 1.6-1.6 3-1.6s1.4 1.6 3 1.6c1.8 0 2.5-2.3 3.7-4.7 1.5-3 2.1-6 .8-8-1.5-2.4-5-2.8-7.5-.8z"/><path d="M9 10.5h6"/>',
  blanqueamiento: '<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>',
  carillas: '<path d="M4 13c2.5 4.5 5.2 6.8 8 6.8s5.5-2.3 8-6.8"/><path d="M7.5 13v3M12 14.5V18M16.5 13v3"/>',
  diseno: '<path d="M12 21c-4.4 0-8-3.6-8-8 0-1 .2-2 .6-2.9 1 .6 2.3.9 3.6.9 1.5 0 2.9-.4 3.8-1.1 1 .7 2.4 1.1 3.8 1.1 1.3 0 2.6-.3 3.6-.9.4.9.6 1.9.6 2.9 0 4.4-3.6 8-8 8z"/>',
  ortodoncia: '<rect x="4" y="9" width="16" height="6" rx="2"/><path d="M8 9v6M12 9v6M16 9v6"/>',
  implantes: '<path d="M10 3h4l-.6 7h-2.8L10 3z"/><path d="M9.2 14h5.6M9.8 17.5h4.4M10.4 21h3.2"/>',
  endodoncia: '<path d="M12 5.5c-2.5-2-6-1.6-7.5.8-1.3 2-.7 5 .8 8 1.2 2.4 1.9 4.7 3.7 4.7 1 0 1.3-1 2.2-1.6.4 1.4 1 3.3 2.5 3.6"/><path d="M12 5.5c2.5-2 6-1.6 7.5.8 1.3 2 .7 5-.8 8-1.2 2.4-1.9 4.7-3.7 4.7-1.6 0-1.6-1.6-3-1.6"/>',
  periodoncia: '<path d="M12 3l8 3.5v5c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5v-5L12 3z"/><path d="M9.5 12l2 2 3.5-4"/>',
  botox: '<path d="M4 20l6.5-6.5"/><path d="M13 4l7 7-4.5 4.5a2.1 2.1 0 0 1-3-3L13 4z"/><path d="M15.5 6.5l2 2"/>',
  labios: '<path d="M12 8.5c-1.5-1.3-4-1.5-6-.5 2 2.6 3.8 5 6 5s4-2.4 6-5c-2-1-4.5-.8-6 .5z"/>',
  volumen: '<circle cx="12" cy="12" r="9"/><path d="M9 15s1.2 1.2 3 1.2 3-1.2 3-1.2"/><path d="M9.5 9.5h.01M14.5 9.5h.01"/>',
  bioestimuladores: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M12 13v3.5M10.2 14.8h3.6"/>',
  rinomodelacion: '<path d="M9 3l6 9-6 3 1.5 6"/>',
  hilos: '<path d="M4 7c4 5 12 5 16 0"/><path d="M4 13c4 5 12 5 16 0"/><path d="M4 19c4 5 12 5 16 0"/>',
  peelings: '<path d="M8 3h8"/><path d="M10 3v6L5.5 17a2.4 2.4 0 0 0 2.3 3h8.4a2.4 2.4 0 0 0 2.3-3L14 9V3"/><path d="M8.5 14h7"/>',
  mesoterapia: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M12 10v5M9.5 12.5h5"/>',
};

const AREAS = {
  odontologia: { label: 'Odontología', icon: ICONS.limpieza },
  armonizacion: { label: 'Armonización Orofacial', icon: ICONS.blanqueamiento },
};

const SERVICES = {
  odontologia: [
    { name: 'Limpieza y profilaxis dental', desc: 'Eliminación de placa y sarro, pulido y flúor para prevenir caries y encías sanas.', icon: ICONS.limpieza },
    { name: 'Blanqueamiento dental', desc: 'Aclaramiento profesional en consultorio para una sonrisa más luminosa y pareja.', icon: ICONS.blanqueamiento },
    { name: 'Carillas de porcelana y composite', desc: 'Láminas ultrafinas que transforman color, forma y alineación de tu sonrisa.', icon: ICONS.carillas },
    { name: 'Diseño de sonrisa', desc: 'Plan 100% personalizado: analizamos tu rostro y tu sonrisa para crear la ideal.', icon: ICONS.diseno },
    { name: 'Ortodoncia y alineadores', desc: 'Alineadores invisibles e ortodoncia fija para corregir tu mordida y estética.', icon: ICONS.ortodoncia },
    { name: 'Implantes dentales', desc: 'Reposición de piezas perdidas con implantes de titanio y coronas naturales.', icon: ICONS.implantes },
    { name: 'Endodoncia (tratamiento de conducto)', desc: 'Salvamos dientes con infección o dolor profundo de forma indolora.', icon: ICONS.endodoncia },
    { name: 'Periodoncia y encías', desc: 'Diagnóstico y tratamiento de gingivitis y periodontitis: la base de tu sonrisa.', icon: ICONS.periodoncia },
  ],
  armonizacion: [
    { name: 'Toxina botulínica (arrugas de expresión)', desc: 'Suavizado de líneas de frente, entrecejo y patas de gallo con efecto natural.', icon: ICONS.botox },
    { name: 'Relleno de labios con ácido hialurónico', desc: 'Volumen, definición y perfilado labial según la armonía de tu rostro.', icon: ICONS.labios },
    { name: 'Voluminización facial (pómulos, mentón, ojeras)', desc: 'Restauramos volúmenes perdidos para un rostro fresco y descansado.', icon: ICONS.volumen },
    { name: 'Bioestimuladores de colágeno', desc: 'Estimulamos tu propio colágeno para firmeza y luminosidad progresiva.', icon: ICONS.bioestimuladores },
    { name: 'Rinomodelación', desc: 'Perfilado y corrección nasal sin cirugía, con ácido hialurónico.', icon: ICONS.rinomodelacion },
    { name: 'Hilos tensores / lifting sin cirugía', desc: 'Efecto lifting inmediato y regeneración de colágeno con hilos tensores.', icon: ICONS.hilos },
    { name: 'Peelings químicos', desc: 'Renovación de la piel: manchas, acné, poros y textura uniforme.', icon: ICONS.peelings },
    { name: 'Mesoterapia y skinbooster', desc: 'Vitaminas e hidratación profunda para piel luminosa y revitalizada.', icon: ICONS.mesoterapia },
  ],
};

const iconSvg = (inner) =>
  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const waIcon = (size = 18) =>
  `<img src="img/whatsapp.svg" alt="" width="${size}" height="${size}" style="display:block" />`;

const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ---------- Render de tarjetas de tratamientos ---------- */
function renderCards(gridId, area) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = SERVICES[area].map((s) => `
    <article class="tcard">
      <div class="tcard-icon">${iconSvg(s.icon)}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="tcard-actions">
        <button class="tcard-btn tcard-btn-book" data-book-area="${area}" data-book-treatment="${s.name}">Reservar turno</button>
        <a class="tcard-btn-wa" data-fx="${area === 'odontologia' ? 'tooth' : 'sparkle'}" href="${waLink(`Hola Pabla! Quiero consultar por: ${s.name}.`)}" target="_blank" rel="noopener" aria-label="Consultar ${s.name} por WhatsApp" title="Consultar por WhatsApp">${waIcon(20)}</a>
      </div>
      <a class="tcard-price" data-fx="${area === 'odontologia' ? 'tooth' : 'sparkle'}" href="${waLink(`Hola Pabla! ¿Me pasás el valor de: ${s.name}?`)}" target="_blank" rel="noopener">Valor a consultar por WhatsApp <span aria-hidden="true">→</span></a>
    </article>`).join('');
}
renderCards('grid-odontologia', 'odontologia');
renderCards('grid-armonizacion', 'armonizacion');

/* ---------- WhatsApp links con texto precargado ---------- */
function applyWaLinks(root = document) {
  root.querySelectorAll('.wa-link[data-wa-text]').forEach((a) => {
    a.href = waLink(a.dataset.waText);
  });
}
applyWaLinks();

/* ---------- Nav: scroll + hamburguesa ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { navLinks.classList.remove('open'); hamburger.classList.remove('active'); }
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Footer: año ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   TURNERO
   ============================================================ */
const state = { area: null, treatment: '', date: '', time: '' };
let staticMode = false; // true cuando el backend no está disponible (ej.: GitHub Pages)

const areaPills = document.querySelectorAll('.area-pill');
const treatmentSelect = document.getElementById('treatmentSelect');
const dateInput = document.getElementById('dateInput');
const slotsGrid = document.getElementById('slotsGrid');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const notesInput = document.getElementById('notesInput');
const bookingForm = document.getElementById('bookingForm');
const formError = document.getElementById('formError');
const bookingSuccess = document.getElementById('bookingSuccess');
const successDetail = document.getElementById('successDetail');
const successWaBtn = document.getElementById('successWaBtn');
const bookAnotherBtn = document.getElementById('bookAnotherBtn');
const submitBtn = document.getElementById('submitBtn');

const sumArea = document.getElementById('sumArea');
const sumTreatment = document.getElementById('sumTreatment');
const sumDate = document.getElementById('sumDate');
const sumTime = document.getElementById('sumTime');

function todayLocalISO() {
  const now = new Date();
  const off = now.getTimezoneOffset();
  return new Date(now.getTime() - off * 60000).toISOString().slice(0, 10);
}
if (dateInput) dateInput.min = todayLocalISO();

function prettyDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function updateSummary() {
  sumArea.textContent = state.area ? AREAS[state.area].label : '—';
  sumTreatment.textContent = state.treatment || '—';
  sumDate.textContent = prettyDate(state.date);
  sumTime.textContent = state.time ? state.time + ' hs' : '—';
}

function selectArea(area, treatment) {
  state.area = area;
  areaPills.forEach((p) => p.classList.toggle('selected', p.dataset.area === area));
  treatmentSelect.innerHTML =
    '<option value="">Elegí un tratamiento…</option>' +
    SERVICES[area].map((s) => `<option value="${s.name}">${s.name}</option>`).join('');
  treatmentSelect.disabled = false;
  if (treatment) {
    treatmentSelect.value = treatment;
    state.treatment = treatment;
  } else {
    state.treatment = '';
  }
  updateSummary();
}

areaPills.forEach((pill) => pill.addEventListener('click', () => selectArea(pill.dataset.area)));
treatmentSelect?.addEventListener('change', () => { state.treatment = treatmentSelect.value; updateSummary(); });

/* Botones "Reservar turno" de las tarjetas */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-book-area]');
  if (!btn) return;
  selectArea(btn.dataset.bookArea, btn.dataset.bookTreatment);
  document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' });
});

/* Horarios de respaldo si el backend no responde (hosting estático) */
function renderFallbackSlots(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  if (day === 0) { slotsGrid.innerHTML = '<p class="slots-empty">Los domingos el consultorio está cerrado.</p>'; return; }
  const end = day === 6 ? 13 : 19;
  const pad2 = (n) => String(n).padStart(2, '0');
  let html = '<p class="slots-empty">Horarios orientativos (la disponibilidad real se confirma por WhatsApp):</p>';
  for (let h = 9; h < end; h++) {
    for (const m of [0, 30]) {
      const t = `${pad2(h)}:${pad2(m)}`;
      html += `<button type="button" class="slot" data-time="${t}">${t}</button>`;
    }
  }
  slotsGrid.innerHTML = html;
}

/* Disponibilidad */
dateInput?.addEventListener('change', async () => {
  state.date = dateInput.value;
  state.time = '';
  updateSummary();
  if (!state.date) { slotsGrid.innerHTML = '<p class="slots-empty">Elegí una fecha para ver los horarios disponibles.</p>'; return; }
  slotsGrid.innerHTML = '<p class="slots-empty">Cargando horarios…</p>';
  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(state.date)}`);
    const data = await res.json();
    if (!res.ok) { slotsGrid.innerHTML = `<p class="slots-empty">${data.error || 'No se pudo cargar la disponibilidad.'}</p>`; return; }
    if (!data.open) { slotsGrid.innerHTML = `<p class="slots-empty">${data.reason || 'Cerrado ese día.'}</p>`; return; }
    slotsGrid.innerHTML = data.slots.map(({ time, taken }) =>
      `<button type="button" class="slot" data-time="${time}" ${taken ? 'disabled title="Horario ocupado"' : ''}>${time}</button>`
    ).join('');
  } catch {
    staticMode = true;
    renderFallbackSlots(state.date);
  }
});

slotsGrid?.addEventListener('click', (e) => {
  const btn = e.target.closest('.slot:not(:disabled)');
  if (!btn) return;
  slotsGrid.querySelectorAll('.slot').forEach((s) => s.classList.remove('selected'));
  btn.classList.add('selected');
  state.time = btn.dataset.time;
  updateSummary();
});

/* Envío del formulario */
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const notes = notesInput.value.trim();

  if (!state.area) return (formError.textContent = 'Elegí el área (paso 1).');
  if (!state.treatment) return (formError.textContent = 'Elegí el tratamiento (paso 2).');
  if (!state.date) return (formError.textContent = 'Elegí el día (paso 3).');
  if (!state.time) return (formError.textContent = 'Elegí el horario (paso 4).');
  if (name.length < 3) return (formError.textContent = 'Ingresá tu nombre y apellido.');
  if (phone.replace(/\D/g, '').length < 8) return (formError.textContent = 'Ingresá un teléfono válido.');

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Enviando…';

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, area: state.area, treatment: state.treatment, date: state.date, time: state.time, notes }),
    });
    const data = await res.json();
    if (!res.ok) {
      formError.textContent = data.error || 'No se pudo reservar. Probá de nuevo.';
      if (res.status === 409) dateInput.dispatchEvent(new Event('change'));
      return;
    }

    // Éxito: mostrar confirmación
    document.querySelector('.booking-wrap').hidden = true;
    bookingSuccess.hidden = false;
    successDetail.innerHTML = `<strong>${name}</strong>, tu turno para <strong>${state.treatment}</strong> quedó registrado para el <strong>${prettyDate(state.date)}</strong> a las <strong>${state.time} hs</strong>. Pabla lo confirmará a la brevedad por WhatsApp.`;
    const waText = `Hola Pabla! Soy ${name}. Reservé un turno online para:\n• Área: ${AREAS[state.area].label}\n• Tratamiento: ${state.treatment}\n• Fecha: ${prettyDate(state.date)}\n• Horario: ${state.time} hs\n¡Gracias!`;
    successWaBtn.dataset.waText = waText;
    successWaBtn.href = waLink(waText);
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    celebrateBooking();
  } catch {
    // Backend no disponible (ej.: GitHub Pages) → reservar por WhatsApp
    staticMode = true;
    const waText = `Hola Pabla! Soy ${name}. Quiero reservar un turno:\n• Área: ${AREAS[state.area].label}\n• Tratamiento: ${state.treatment}\n• Fecha: ${prettyDate(state.date)}\n• Horario: ${state.time} hs\n• Teléfono: ${phone}${notes ? `\n• Nota: ${notes}` : ''}`;
    window.open(waLink(waText), '_blank', 'noopener');
    document.querySelector('.booking-wrap').hidden = true;
    bookingSuccess.hidden = false;
    successDetail.innerHTML = `¡Perfecto, <strong>${name}</strong>! Abrimos WhatsApp con el detalle de tu solicitud para <strong>${state.treatment}</strong> (${prettyDate(state.date)}, ${state.time} hs). Si no se abrió, tocá el botón de abajo.`;
    successWaBtn.dataset.waText = waText;
    successWaBtn.href = waLink(waText);
    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    celebrateBooking();
    return;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Solicitar turno
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
  }
});

/* Reservar otro turno */
bookAnotherBtn?.addEventListener('click', () => {
  bookingForm.reset();
  state.area = null; state.treatment = ''; state.date = ''; state.time = '';
  treatmentSelect.innerHTML = '<option value="">Primero elegí un área…</option>';
  treatmentSelect.disabled = true;
  areaPills.forEach((p) => p.classList.remove('selected'));
  slotsGrid.innerHTML = '<p class="slots-empty">Elegí una fecha para ver los horarios disponibles.</p>';
  updateSummary();
  document.querySelector('.booking-wrap').hidden = false;
  bookingSuccess.hidden = true;
});

/* ============================================================
   EFECTOS: muelitas y destellos al interactuar
   ============================================================ */
const FX_ICONS = {
  tooth: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5c-2.5-2-6-1.6-7.5.8-1.3 2-.7 5 .8 8 1.2 2.4 1.9 4.7 3.7 4.7 1.6 0 1.6-1.6 3-1.6s1.4 1.6 3 1.6c1.8 0 2.5-2.3 3.7-4.7 1.5-3 2.1-6 .8-8-1.5-2.4-5-2.8-7.5-.8z"/><path d="M9.5 11h5"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>',
};
const fxLayer = (() => {
  const d = document.createElement('div');
  d.id = 'fx-layer';
  document.body.appendChild(d);
  return d;
})();
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function burst(x, y, kind, count = 9) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = `fx-particle fx-${kind}`;
    el.innerHTML = FX_ICONS[kind];
    const ang = Math.random() * Math.PI * 2;
    const dist = 46 + Math.random() * 78;
    el.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    el.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
    el.style.setProperty('--rot', `${Math.random() * 340 - 170}deg`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.addEventListener('animationend', () => el.remove());
    fxLayer.appendChild(el);
  }
  const big = document.createElement('span');
  big.className = `fx-pop fx-${kind}`;
  big.innerHTML = FX_ICONS[kind];
  big.style.left = `${x}px`;
  big.style.top = `${y}px`;
  big.addEventListener('animationend', () => big.remove());
  fxLayer.appendChild(big);
}
const fxKindFor = (v) => (String(v || '').toLowerCase().includes('armonizacion') ? 'sparkle' : 'tooth');

document.addEventListener('click', (e) => {
  const fxEl = e.target.closest('[data-fx]');
  if (fxEl) { burst(e.clientX, e.clientY, fxEl.dataset.fx); return; }
  const book = e.target.closest('[data-book-area]');
  if (book) { burst(e.clientX, e.clientY, fxKindFor(book.dataset.bookArea)); }
});

/* Celebración al enviar el turno */
function celebrateBooking() {
  const icon = document.querySelector('.success-icon');
  if (!icon) return;
  const r = icon.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  burst(cx, cy, 'tooth', 8);
  burst(cx, cy, 'sparkle', 8);
}
