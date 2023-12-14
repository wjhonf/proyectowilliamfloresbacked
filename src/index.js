const express = require('express');
const bodyParser = require('body-parser');
const productosController = require('./productosController');
const carritosController = require('./carritosController');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

productosController.cargarDatos();
carritosController.cargarDatos();

const productsRouter = express.Router();
productsRouter.get('/', productosController.obtenerProductos);
productsRouter.get('/:pid', productosController.obtenerProductoPorId);

// ...

const cartsRouter = express.Router();
cartsRouter.get('/', carritosController.obtenerCarritos);
cartsRouter.get('/:cid', carritosController.obtenerCarritoPorId);
cartsRouter.post('/', carritosController.crearCarrito);

// ...


// Usa el router de products en la ruta /api/products
app.use('/api/products', productsRouter);

// Usa el router de carts en la ruta /api/carts
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

process.on('exit', () => {
  console.log('Guardando datos antes de salir...');
  productosController.guardarDatos();
  carritosController.guardarDatos();
});
