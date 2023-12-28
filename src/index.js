const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const { port } = require('./configs/server.config');
const router = require('./router');
const { Server } = require('socket.io');
const agregarProducto = require('./controllers/product.controller').agregarProducto;
const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

app.use(express.static(process.cwd() + '/src/public'));

// Escuchando servidor
const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);
io.on('connection', socket => {
  console.log(socket.id);
  socket.on('message', data => {
    console.log(data);
  });
  socket.emit('messageServer', 'Hola desde el servidor');
  socket.broadcast.emit('messageOthers', 'Hola a todos menos al server');
  io.emit('messageAll', 'Hola a todos los usuarios del sistema');
});

router(app, io);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});
