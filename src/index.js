const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const productosController = require('./productosController');
const carritosController = require('./carritosController');
const productos = productosController.productos;


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

productosController.cargarDatos();
carritosController.cargarDatos();

const productsRouter = express.Router();
productsRouter.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || undefined;

  if (limit) {
    const productosLimitados = productos.slice(0, limit);
    res.json(productosLimitados);
  } else {
    productosController.obtenerProductos(req, res);
  }
});
productsRouter.get('/:pid', productosController.obtenerProductoPorId);
productsRouter.post('/', async (req, res, next) => {
  try {
    console.log('Antes de productosController.crearProducto');
    await productosController.crearProducto(req, res);
    console.log('Después de productosController.crearProducto');
  } catch (error) {
    console.error('Error en la ruta POST /', error);
    next(error);
  }
});
productsRouter.put('/:pid', productosController.actualizarProducto);
productsRouter.delete('/:pid', productosController.eliminarProducto);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

const cartsRouter = express.Router();
cartsRouter.get('/', carritosController.obtenerCarritos);
cartsRouter.get('/:cid', carritosController.obtenerCarritoPorId);
cartsRouter.post('/', carritosController.crearCarrito);
cartsRouter.post('/:cid/producto/:pid', carritosController.agregarProductoAlCarrito);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.get('/', (req, res) => {
  res.render('home', { productos });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.emit('productos', productos);
  socket.on('nuevoProducto', (producto) => {
    productos.push(producto);
    io.emit('productos', productos);
  });

  socket.on('eliminarProducto', (productId) => {
    productos = productos.filter((p) => p.id !== productId);
    io.emit('productos', productos);
  });


  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

process.on('exit', () => {
  console.log('Guardando datos antes de salir...');
  productosController.guardarDatos();
  carritosController.guardarDatos();
});
