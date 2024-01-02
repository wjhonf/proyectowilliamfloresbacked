const express = require('express');
const handlebars = require('express-handlebars');
const { port } = require('./configs/server.config');
const router = require('./router');
const { Server } = require('socket.io');
const axios = require('axios');
const app = express();

app.use(express.json());

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
  socket.on('addProduct', data => {
    axios.post('http://localhost:8080/api/products', data)
      .then(response => {
        console.log('Producto agregado:', response.data);
        io.emit('productAdded', response.data);
      })
      .catch(error => {
        console.error('Error al agregar producto:', error.message);
      });
  });
});

router(app, io);
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});
