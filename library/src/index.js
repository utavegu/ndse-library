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
const tsBooksAPIRouting = require('./routes/ts-books-api');

const socketConnectionCallback = require('./utils/socket');

const config = require('./config');

config.activatePassport();

const app = express();
// Способ запуска через http нужен для работы socketIO, в других случаях хватило бы просто app
const server = http.Server(app);
const io = socketIO(server);

/*
TODO: При запуске через docker-compose.dev.yml (теперь и в прод-версии сломалось... но работало, пока в прод-версии не был закомментирован вольюм - это зацепка для отлова бага) выдает:
/app/src/middleware/logger.js:10
if (error) throw error;
  [Error: EACCES: permission denied, open 'src/server.log'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'open',
  path: 'src/server.log'
}
1) Простое решение - закомментировать строку с .use(logger) ниже
2) Сложное - разбирайся, если будет время
*/

const { connectionUrl, user, password, database } = config.db

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, './views'))
  .use(session({ secret: 'SECRET' }))
  .use(passport.initialize())
  .use(passport.session())
  // .use(logger)
  .use('/', mainPageRouting)
  .use('/user', authRouting)
  .use('/api/books', booksAPIRouting)
  .use('/books', booksTemplateRouting)
  .use('/ts/books', tsBooksAPIRouting)
  .use(error404);

io.on('connection', socketConnectionCallback);

const start = async () => {
  try {
    await mongoose.connect(connectionUrl, {
      user: user,
      pass: password,
      dbName: database,
    });
    // было апп стало сервер
    server.listen(config.services.libraryPort, () => {
      console.log(`Сервер библиотеки слушает на ${config.services.libraryPort} порту! Подключение к базе данных ${database} произведено успешно!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
