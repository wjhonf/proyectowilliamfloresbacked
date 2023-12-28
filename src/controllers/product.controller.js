const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');

const setup = (io) => {
  router.get('/home', (req, res) => {
    const equipos = obtenerEquipos();
    res.render('home', { equipos });
  });

  router.get('/realtimeproducts', (req, res) => {
    const equipos = obtenerEquipos();
    res.render('realTimeProducts', { equipos });
  });

  router.post('/api/products', (req, res) => {
    const productData = req.body;

    agregarProducto(productData);

    emitUpdateEvent(io);
    res.status(200).json({ message: 'Producto agregado correctamente', product: productData });
  });

  const emitUpdateEvent = () => {
    io.emit('updateProducts');
  };

  const obtenerEquipos = () => {
    const archivo = 'equipos.json';
    const filePath = path.join(rootDir, 'datos', archivo);

    try {
      const datos = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(datos) || [];
    } catch (error) {
      console.error(`Error al cargar los datos de ${archivo}:`, error.message);
      return [];
    }
  };

  const agregarProducto = (producto) => {
    const archivo = 'equipos.json';
    const filePath = path.join(rootDir, 'datos', archivo);

    try {
      const datos = fs.readFileSync(filePath, 'utf8');
      const productos = JSON.parse(datos) || [];

      productos.push(producto);

      fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
      console.log('Producto agregado correctamente:', producto);
    } catch (error) {
      console.error(`Error al agregar producto a ${archivo}:`, error.message);
    }
  };
  return router;
};



module.exports = setup;
