const fs = require('fs');
const path = require('path');


let carritos = [];

const cargarDatos = () => {
  const archivo = 'carritos.json';
  const filePath = path.join(__dirname, '..', 'datos', archivo);

  try {
    const datos = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(datos) || [];
  } catch (error) {
    console.error(`Error al cargar los datos de ${archivo}:`, error.message);
    return [];
  }
};

const guardarDatos = () => {
  const archivo = 'carritos.json';
  const filePath = path.join(__dirname, '..', 'datos', archivo);

  try {
    fs.writeFileSync(filePath, JSON.stringify(carritos, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error al guardar los datos de ${archivo}:`, error.message);
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
