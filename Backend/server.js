const express = require('express');
const path = require('path');
const productRouter = require('./routes/product.api.route');

const app = express();

app.use(express.json());

// Simple CORS middleware - allow requests from any origin by default.
// In production you may want to restrict this to your frontend origin.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth, x-user, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/api', productRouter);

// Serve frontend static files from the `docs` folder so the same build
// works for GitHub Pages (docs/) and when the backend serves the site.
const docsPath = path.join(__dirname, '..', 'docs');
app.use(express.static(docsPath));

// Dynamic backend.url: when the backend serves the frontend it will
// return its own origin so the frontend can call the API at the
// correct address. For GitHub Pages the static file docs/backend.url
// should be updated to the deployed backend URL (see README).
app.get('/backend.url', (req, res) => {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    res.type('text/plain').send(`${proto}://${host}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(docsPath, 'index.html'));
});

const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`Servidor corriendo en puerto ${actualPort}`);
});