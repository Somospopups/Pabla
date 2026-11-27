# Od. Pabla María Bonaudi — Sitio web

Sitio profesional para **Od. Pabla María Bonaudi** — Odontología & Armonización Orofacial · Córdoba, Argentina.
MP 12469 · WhatsApp 351 216 6540 · Instagram [@od.pablabonaudi](https://www.instagram.com/od.pablabonaudi)

## Estructura

```
pabla-bonaudi/
├── server.js          → Backend Node.js (sin dependencias): sitio + API de turnos + panel admin
├── public/
│   ├── index.html     → Sitio público (una página, secciones por área)
│   ├── styles.css     → Estilos (paleta bordo / crema / dorado)
│   ├── app.js         → Lógica del turnero y WhatsApp
│   ├── admin.html     → Panel profesional (agenda, confirmar/cancelar, exportar CSV)
│   └── img/           → Imágenes (generadas por IA — reemplazar por fotos reales)
└── data/              → appointments.json (se crea solo al reservar)
```

## Cómo correrlo (con turnero completo)

Requisito: [Node.js](https://nodejs.org/) 18+

```bash
node server.js
```

Abrir http://localhost:3000 — Panel profesional en http://localhost:3000/admin.html

**Contraseña del panel admin:** `pabla2026` (cambiar con la variable de entorno `ADMIN_PASSWORD`):

```bash
ADMIN_PASSWORD=miclave node server.js
```

Los turnos se guardan en `data/appointments.json` (ignorado por git).

## Hosting estático (ej.: GitHub Pages)

Si el sitio se publica en GitHub Pages u otro hosting estático, **la API no funciona**:
el turnero entra automáticamente en modo “reserva por WhatsApp” (abre WhatsApp con el detalle del turno)
y el panel admin (`admin.html`) no estará disponible. Para el turnero completo con panel,
desplegar en un hosting con Node.js (Render, Railway, Fly.io, etc.).

### Publicar en GitHub Pages
1. Subir este repositorio a GitHub
2. *Settings → Pages → Deploy from branch → `main` → `/ (root)`*
   (o mover el contenido de `public/` a la raíz / usar la carpeta `public/` como root)

## Personalizar

- **Tratamientos y textos:** `public/app.js` (constante `SERVICES`, debe coincidir con `SERVICES` en `server.js`) y `public/index.html`
- **Número de WhatsApp:** constante `WA_NUMBER` en `public/app.js` y los links `wa.me/5493512166540` en el HTML
- **Horarios de atención:** función `slotsForDate` en `server.js` y los textos de horarios en el HTML
- **Imágenes:** reemplazar los archivos en `public/img/` conservando los nombres

## Créditos y notas

- Imágenes generadas con IA como placeholder — reemplazar por fotos reales de la profesional y el consultorio.
- El sitio no reemplaza la consulta profesional.
