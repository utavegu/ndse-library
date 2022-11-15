/*
- переход на контроллеры
- рефактор по кодревью и вотч
- Когда все заработает, зафиксируй версии монг в докер-композе
*/

const express = require('express');
const mongoose = require('mongoose');

// const logger = require('./middleware/logger');
const error404 = require('./middleware/404');

const instructionRouting = require('./routes/instruction')
const authRouting = require('./routes/auth');
const booksRouting = require('./routes/books');

const app = express();
app.use(express.json());

const { PORT, MONGODB_URL, MONGODB_LOGIN, MONGODB_PASSWORD, DB_NAME } = process.env;

// app.use(logger); // Потерял в контейнере директорию и файл сервера, надо разобраться

app.use('/', instructionRouting);
app.use('/api/user/login', authRouting);
app.use('/api/books', booksRouting);

app.use(error404);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      user: MONGODB_LOGIN,
      pass: MONGODB_PASSWORD,
      dbName: DB_NAME,
    });
    app.listen(PORT, () => {
      console.log(`Сервер библиотеки слушает на ${PORT} порту! Подключение к базе данных ${DB_NAME}  произведено успешно!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
