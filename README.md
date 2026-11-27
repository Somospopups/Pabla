# Od. Pabla María Bonaudi — Sitio web

Sitio profesional para **Od. Pabla María Bonaudi** — Odontología & Armonización Orofacial · Córdoba, Argentina.
MP 12469 · WhatsApp 351 216 6540 · Instagram [@od.pablabonaudi](https://www.instagram.com/od.pablabonaudi)

## Estructura (lista para GitHub Pages)

```
├── index.html       → Sitio público (una página, secciones por área)
├── styles.css       → Estilos (paleta bordo / crema / dorado)
├── app.js           → Lógica del turnero y WhatsApp
├── admin.html       → Panel profesional (agenda, confirmar/cancelar, exportar CSV)
├── img/             → Imágenes (generadas por IA — reemplazar por fotos reales)
├── server/
│   └── server.js    → Backend Node.js (SIN dependencias): sitio + API de turnos + panel admin
└── data/            → appointments.json (se crea solo al reservar; no se versiona)
```

## Publicar en GitHub Pages (sitio estático)

1. Subir todo el contenido de este repo a GitHub
2. *Settings → Pages → Build and deployment → Deploy from a branch*
3. Branch: `main` · Folder: `/ (root)` → Save
4. El sitio queda en `https://<usuario>.github.io/Pabla/`

**Importante:** en GitHub Pages no corre el backend. En ese escenario el turnero pasa
automáticamente a **modo reserva por WhatsApp** (abre WhatsApp con el detalle del turno)
y el panel `admin.html` no estará operativo.

## Sitio completo con turnero real (Node.js)

Requisito: [Node.js](https://nodejs.org/) 18+ (sin npm install: cero dependencias).

```bash
node server/server.js
```

Abrir http://localhost:3000 — Panel profesional en http://localhost:3000/admin.html

**Contraseña del panel:** se define con la variable de entorno `ADMIN_PASSWORD`.
Si no se define, el servidor genera una aleatoria y la imprime en la consola al iniciar:

```bash
ADMIN_PASSWORD=TuClaveSegura node server/server.js
```

Los turnos se guardan en `data/appointments.json`.

> ⚠️ Si el repo es público, **no pongas contraseñas reales en el código**.
> El servidor directo de Node (server/*.js), los datos y archivos internos no se publican como estáticos.

## Personalizar

- **Tratamientos y textos:** `app.js` (constante `SERVICES`, debe coincidir con `SERVICES` en `server/server.js`) y `index.html`
- **Número de WhatsApp:** constante `WA_NUMBER` en `app.js` y los links `wa.me/5493512166540` en el HTML
- **Horarios de atención:** función `slotsForDate` en `server/server.js` y textos de horarios en el HTML
- **Imágenes:** reemplazar los archivos en `img/` conservando los nombres

## Notas

- El retrato de Pabla es una foto real (enviada por el cliente) con retoque de luz. Las imágenes de consultorio/tratamientos son de apoyo visual (IA). Reemplazar por fotos reales del consultorio cuando estén disponibles.
- El sitio no reemplaza la consulta profesional.

## Agregados tipo "centro médico premium" (inspirados en anandacentromedico.es)

- **Blog** (`blog.html` + `blog-*.html`): 3 artículos SEO en español rioplatense con schema Article. Agregar más artículos siguiendo el mismo formato y subirlos al `sitemap.xml`.
- **SEO técnico completo**: JSON-LD `Dentist` + `FAQPage` en `index.html`, Open Graph, Twitter Card, canonical, `robots.txt`, `sitemap.xml`. Si cambiás de dominio, actualizá URLs en `sitemap.xml`, `robots.txt`, canonical y JSON-LD.
- **Sección "Lo más buscado en Córdoba"**: chips con links internos (SEO).
- **Tarjeta regalo**: CTA a WhatsApp con mensaje precargado. No requiere backend.
- **Reseñas**: sección "¿Te atendimos?" con link a Google Maps. Si Pabla activa su perfil de Google Business Profile y acumula reseñas, reemplazar ese bloque por un widget de Trustindex (gratis: trustindex.io — crear widget → pegar el <script> donde está `.reviews-box`).
- **Precios**: a propósito NO se publican valores (cambian con frecuencia). Cada tratamiento tiene "Valor a consultar por WhatsApp".
- **Botón Llamar** (tel:) en hero, CTA final y footer.
- **Testimonios**: no se inventaron reseñas. Cuando haya reseñas reales de Google, cargarlas o activar Trustindex.

## Checklist antes de publicar

1. `node server/server.js` y probar: reservar un turno, entrar al admin (`/admin.html`).
2. Revisar textos, teléfonos y horarios con Pabla.
3. Fotos reales del consultorio si las hay (reemplazar `img/*.jpg` del sitio manteniendo nombres).
4. Si hay perfil de Google Business Profile → cargar link de reseñas y/o activar Trustindex.
