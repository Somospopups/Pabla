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
