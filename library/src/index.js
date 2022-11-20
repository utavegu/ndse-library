/*
TODO
- Когда все заработает, зафиксируй версии монг в докер-композе (возьми те, что как лэйтест на текущий момент)
- рефактор по кодревью и вотч
- Ветку с шаблонизатором, в идеале, тоже интегрировать (книг)
- разобраться как делать непрерывную разработку через вольюм и нодемон -L
- Вернуть ручкам функциональность счетчика и загрузки/скачивания книги
- Рефактор: сетап джээс
*/

const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const logger = require('./middleware/logger');
const error404 = require('./middleware/404');

const instructionRouting = require('./routes/instruction') // Тут сделай какое-нибудь приветствие со ссылкой на книги и объявление, что добавлять и удалять книги могут только зарегистрированные пользователи
const authRouting = require('./routes/auth');
const booksRouting = require('./routes/books');

const User = require('./models/user');
const verify = require('./utils/verify');

// Претендент на сетап-джээс
const { PORT, MONGODB_URL, MONGODB_LOGIN, MONGODB_PASSWORD, DB_NAME } = process.env;

// Претендент на сетап-джээс
const options = {
  usernameField: "username",
  passwordField: "password",
}

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
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, './views'))
  .use(session({ secret: 'SECRET' }))
  .use(passport.initialize())
  .use(passport.session())
  // app.use(logger); // Потерял в контейнере директорию и файл сервера, надо разобраться
  .use('/', instructionRouting)
  .use('/user', authRouting)
  .use('/api/books', booksRouting)
  .use(error404);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      user: MONGODB_LOGIN,
      pass: MONGODB_PASSWORD,
      dbName: DB_NAME,
    });
    app.listen(PORT, () => {
      console.log(`Сервер библиотеки слушает на ${PORT} порту! Подключение к базе данных ${DB_NAME} произведено успешно!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
