const express = require('express');
const path = require('path');
const productRouter = require('./routes/product.api.route');

const app = express();

app.use(express.json());
app.use('/api', productRouter);

// Serve frontend static files (so frontend and backend share same origin)
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

const PORT = 3100;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
