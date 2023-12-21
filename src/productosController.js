const fs = require('fs');
const path = require('path');
let productos = [];
const cargarDatos = () => {
  const archivo = 'equipos.json';
  const filePath = path.join(__dirname, '..', 'datos', archivo);

  try {
    const datos = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(datos) || [];
  } catch (error) {
    console.error(`Error al cargar los datos de ${archivo}:`, error.message);
    return [];
  }
};

const guardarDatos = async () => { // Agrega async aquí
  const archivo = 'equipos.json';
  const filePath = path.join(__dirname, '..', 'datos', archivo);

  try {
    await fs.writeFile(filePath, JSON.stringify(productos, null, 2), 'utf8'); // Usa await aquí
  } catch (error) {
    console.error(`Error al guardar los datos de ${archivo}:`, error.message);
    throw error; // Propaga el error para manejarlo en el llamador si es necesario
  }
};
const obtenerProductos = (req, res) => {
  res.json(productos);
};
const obtenerProductoPorId = (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    const producto = productos.find((p) => p.id === productId);
  
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ mensaje: 'Equipos no encontrado' });
    }
  };

  const crearProducto = (req, res) => {
    console.log('Entró en crearProducto');
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;
  
    const newProductId = productos.length + 1;
    const nuevoProducto = {
      id: newProductId,
      title,
      description,
      code,
      price: parseFloat(price),
      status: Boolean(status),
      stock: parseInt(stock, 10),
      category,
      thumbnails,
    };
  
    productos.push(nuevoProducto);
  
    guardarDatos();
  
    
    res.status(201).json(nuevoProducto);
  };

const actualizarProducto = (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const index = productos.findIndex((p) => p.id === productId);

  if (index !== -1) {
    const updatedProduct = req.body;

    delete updatedProduct.id;
    Object.assign(productos[index], updatedProduct);
    res.json(productos[index]);
    guardarDatos();
  } else {
    res.status(404).json({ mensaje: 'Equipos no encontrado' });
  }
};

const eliminarProducto = (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const index = productos.findIndex((p) => p.id === productId);

  if (index !== -1) {
    const deletedProduct = productos.splice(index, 1)[0];
    res.json(deletedProduct);
    guardarDatos();
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
};

module.exports = {
  productos,
  cargarDatos,
  guardarDatos,
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
