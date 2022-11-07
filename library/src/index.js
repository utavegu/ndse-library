const express = require('express');
// const logger = require('./middleware/logger');
const error404 = require('./middleware/404');
const instructionRouting = require('./routes/instruction')
const authRouting = require('./routes/auth');
const booksRouting = require('./routes/books');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

// app.use(logger); // Потерял в контейнере директорию и файл сервера, надо разобраться

app.use('/', instructionRouting);
app.use('/api/user/login', authRouting);
app.use('/api/books', booksRouting);

app.use(error404);

app.listen(PORT, () => {
  console.log(`Сервер библиотеки слушает на ${PORT} порту!`);
})