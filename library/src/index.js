/*
TODO-s:
- Когда все заработает, зафиксируй версии монг в докер-композе/докерфайлах, если она там есть (возьми те, что как лэйтест на текущий момент)
- Рефактор: сетап джээс (это уже после того, как пересмотришь лекцию)
- композ дев (без енв переменных, билда и арг нод енв продакшн и с вольюмом для сорса... и шпаргалкой как его запускать)
- Поменять логины, пароли и порты для подключения к монге
- Чистка комментариев и переписывание/доделывание тудусов
- При создании книги заметил странность - если создавать через шаблоны, то он будет выкидывать ошибку про незаполненность обязательных полей. Если через АПИ - подставит в них дефолтные значения модели. Хм.
- Залогиненный пользователь походу после каждого изменения то ли в базе, то ли в коде отваливается. Ну это неправильно, разумеется.
- Подчистить old-book и fakeDatabase - в старых ветках же они все равно остались
- Books*Controller.protectBook - работают исправно, но разрабатывать мешают, потому пока отключил
*/

const express = require('express');
const path = require('path');
const http = require('http');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');

const logger = require('./middleware/logger');
const error404 = require('./middleware/404');

const mainPageRouting = require('./routes/main');
const authRouting = require('./routes/auth');
const booksAPIRouting = require('./routes/books-api');
const booksTemplateRouting = require('./routes/books-templates');

const verify = require('./utils/verify');
const socketSetup = require('./utils/socket');

const User = require('./models/user');

// Претендент на сетап-джээс
const { PORT, MONGODB_URL, MONGODB_LOGIN, MONGODB_PASSWORD, DB_NAME } = process.env;

// Претендент на сетап-джээс
const options = {
  usernameField: "username",
  passwordField: "password",
}

// TODO: А вот эти 3 штуки, интересно, можно ли тоже в одно слово завернуть... что-то типа const passportSetup = {...};
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id).select('-__v')
    cb(null, user)
  } catch (error) {
    return cb(error)
  }
})

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

io.on('connection', socketSetup);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      user: MONGODB_LOGIN,
      pass: MONGODB_PASSWORD,
      dbName: DB_NAME,
    });
    // было апп стало сервер
    server.listen(PORT, () => {
      console.log(`Сервер библиотеки слушает на ${PORT} порту! Подключение к базе данных ${DB_NAME} произведено успешно!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
