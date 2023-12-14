const fs = require('fs');

let carritos = [];

const cargarDatos = () => {
  try {
    const carritosData = fs.readFileSync('./datos/carritos.json', 'utf8');
    carritos = JSON.parse(carritosData) || [];
  } catch (error) {
    console.error('Error al cargar los datos de carrito:', error.message);
  }
};

const guardarDatos = () => {
  try {
    fs.writeFileSync('./datos/carritos.json', JSON.stringify(carritos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar los datos de carrito:', error.message);
  }
};

const obtenerCarritos = (req, res) => {
  res.json(carritos);
};

const obtenerCarritoPorId = (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const carrito = carritos.find((c) => c.id === cartId);

  if (carrito) {
    res.json(carrito);
  } else {
    res.status(404).json({ mensaje: 'Carrito no encontrado' });
  }
};

const crearCarrito = (req, res) => {
  const newCartId = carritos.length + 1;
  const nuevoCarrito = {
    id: newCartId,
    products: [],
  };

  carritos.push(nuevoCarrito);
  res.status(201).json(nuevoCarrito);
  guardarDatos();
};

// Resto de las funciones del controlador...

module.exports = {
  cargarDatos,
  guardarDatos,
  obtenerCarritos,
  obtenerCarritoPorId,
  crearCarrito,
  // Resto de las funciones del controlador...
};
