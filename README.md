# Proyecto GameHub — Despliegue

Ubicación canonical del frontend: `docs/`. Backend: `Backend/`.

Resumen rápido
- El frontend está consolidado en la carpeta `docs/` para ser servido por GitHub Pages.
- El backend corre desde `Backend/` y ahora sirve `docs/` cuando se ejecuta (útil para Render).

Despliegue en Render (recomendado para backend + frontend conjunto)
1. Crea un Web Service en Render apuntando al repo.
2. Puedes usar la raíz del repositorio (se añadió `package.json` en la raíz).
   - Render ejecutará `npm install` y `npm start`.
   - El `start` lanzará `node Backend/server.js`.
   - Alternativa: configura Root Directory = `Backend` y Start Command = `npm start`.
3. El servidor expone `/api` y sirve los archivos estáticos desde `docs/`.
4. Cuando el backend sirva el frontend, el endpoint `/backend.url` devolverá la URL del servicio automáticamente.

Despliegue en GitHub Pages (sitio estático)
1. En GitHub → Settings → Pages: Source → branch `main` (o tu rama) y carpeta `/docs`.
2. IMPORTANTE: una vez que despliegues el backend en Render y obtengas la URL (por ejemplo `https://mi-backend.onrender.com`), actualiza el archivo `docs/backend.url` con esa URL y haz push. GitHub Pages leerá ese archivo para configurar `window.BACKEND_URL`.
