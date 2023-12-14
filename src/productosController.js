const fs = require('fs');

let productos = [];

const cargarDatos = () => {
  try {
    const productosData = fs.readFileSync('./datos/equipos.json', 'utf8');
    productos = JSON.parse(productosData) || [];
  } catch (error) {
    console.error('Error al cargar los datos de equipos:', error.message);
  }
};

const guardarDatos = () => {
  try {
    fs.writeFileSync('./datos/equipos.json', JSON.stringify(productos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar los datos de equipos:', error.message);
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

  res.status(201).json(nuevoProducto);

  guardarDatos();
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
  cargarDatos,
  guardarDatos,
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
