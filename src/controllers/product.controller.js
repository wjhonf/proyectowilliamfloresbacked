const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
let lastProductId = 0;

const emitUpdateEvent = (io) => {
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

const agregarProducto = (producto, io) => {
  const archivo = 'equipos.json';
  const filePath = path.join(rootDir, 'datos', archivo);

  try {
    const datos = fs.readFileSync(filePath, 'utf8');
    const productos = JSON.parse(datos) || [];
    const newProductId = ++lastProductId;

    const newProduct = {
      id: newProductId,
      ...producto,
    };
    productos.push(newProduct);

    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
    emitUpdateEvent(io);
  } catch (error) {
    console.error(`Error al agregar producto a ${archivo}:`, error.message);
  }
};

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
    agregarProducto(productData, io); 
    emitUpdateEvent(io);
    res.status(200).json({ message: 'Producto agregado correctamente', product: productData });
  });

  return router;
};

module.exports = {
  setup,
  agregarProducto,
};
