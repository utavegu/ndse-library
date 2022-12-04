const express = require('express');
const path = require('path');
const http = require('http');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const socketIO = require('socket.io');

const logger = require('./middleware/logger');
const error404 = require('./middleware/404');

const mainPageRouting = require('./routes/main');
const authRouting = require('./routes/auth');
const booksAPIRouting = require('./routes/books-api');
const booksTemplateRouting = require('./routes/books-templates');

const socketConnectionCallback = require('./utils/socket');

const config = require('./config');
const { PORT } = process.env;

config.activatePassport();

const app = express();
// Способ запуска через http нужен для работы socketIO, в других случаях хватило бы просто app
const server = http.Server(app);
const io = socketIO(server);

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, './views'))
  .use(session({ secret: 'SECRET' }))
  .use(passport.initialize())
  .use(passport.session())
  .use(logger)
  .use('/', mainPageRouting)
  .use('/user', authRouting)
  .use('/api/books', booksAPIRouting)
  .use('/books', booksTemplateRouting)
  .use(error404);

io.on('connection', socketConnectionCallback);

const start = async () => {
  try {
    await mongoose.connect(config.db.connectionUrl, {
      user: config.db.user,
      pass: config.db.password,
      dbName: config.db.database,
    });
    // было апп стало сервер
    server.listen(PORT, () => {
      console.log(`Сервер библиотеки слушает на ${PORT} порту! Подключение к базе данных ${config.db.database} произведено успешно!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
