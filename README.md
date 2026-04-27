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

Probar localmente
- Instala dependencias del backend: `npm install --prefix Backend`
- Ejecuta el backend (que servirá el frontend): `npm start`
- Abre `http://localhost:3100`

Cambios realizados
- `Backend/server.js` actualizado para servir `docs/` y ofrecer `/backend.url` dinámico.
- Archivo `package.json` añadido en la raíz para facilitar despliegues en Render.
- Archivos frontend duplicados en la raíz y `Frontend/` han sido eliminados; la ubicación canónica es `docs/`.

Si prefieres que el frontend permanezca en la raíz en lugar de `docs/`, puedo revertir estos cambios o moverlo según prefieras.
