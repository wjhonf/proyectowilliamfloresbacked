const express = require('express');
const handlebars = require('express-handlebars');
const { port } = require('./configs/server.config');
const router = require('./router');
const { Server } = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store')
//const { dbUser, dbPassword, dbHost, dbName } = require('../configs/db.config')
const MongoStore = require('connect-mongo');
const mongoConnect= require('./db');
const path = require('path');
const fileStorage = fileStore(session)
const initializePassport = require('./configs/passport.config')

const passport = require('passport')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(process.cwd() + '/src/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

/*app.use(
  session({
    secret: 'Williamsecret',
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://admin:admin@cluster0.8i3kfch.mongodb.net/session?retryWrites=true&w=majority',
    }),
    resave: false,
    saveUninitialized: false,
  })
)*/
mongoConnect()
initializePassport()
app.use(passport.initialize())
//app.use(passport.session())

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
