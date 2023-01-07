import express from 'express';

import booksRouting from './entities/books/books.routes';
import config from './config';

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/books', booksRouting)

const start = async () => {
  try {
    require("./config/db_connection");
    app.listen(config.services.libraryPort, () => {
      console.log(`Сервер библиотеки слушает на ${config.services.libraryPort} порту!`);
    })
  } catch (error) {
    console.error(String(error))
  }
}

start().catch(error => console.error(error));
