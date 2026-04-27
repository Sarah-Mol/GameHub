const express = require('express');
const productRouter = require('./routes/product.api.route');

const app = express();

app.use(express.json());
app.use('/api', productRouter);

// ruta base para probar que funciona
app.get('/', (req, res) => {
    res.send("Backend funcionando");
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Servidor corriendo`);
});