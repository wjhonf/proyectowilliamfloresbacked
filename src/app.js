
const express = require('express');
const productManager = require('./productManager');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/equipos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productos = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
document.getElementById('datatable-pendientes')
app.get('/equipos/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const producto = await productManager.getProductById(productId);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Equipos no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/equipos', async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    await productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.json({ message: 'Equipo agregado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/equipos/:id', async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    await productManager.deleteProduct(productId);
    res.json({ message: 'Equipo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/equipos/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;

  try {
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Equipo actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
