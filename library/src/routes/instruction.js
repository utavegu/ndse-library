const express = require('express');

const router = express.Router();

// Вы можете подтвердить свои права библиотекаря, чтобы иметь возможность добавлять книги. Или проследовать в библиотеку. А еще тут есть апи, на случай появления микросервиса фронтенда.

router.get(
  '/',
  (_, responce) => {
    responce.send(`
      Сервер успешно запущен на ${process.env.PORT || 3002} порту
      Инструкция к API:
      POST: /api/user/login - псевдоавторизация
      GET: /api/books - запрос всей библиотеки
      POST: /api/books - добавление новой книги
      GET: /api/books/:id - запрос информации об одной книге
      PUT: /api/books/:id - изменение данных о уже имеющейся в библиотеке книге
      DELETE: /api/books/:id - удаление данных о книге из библиотеки
      GET: /api/books/:id/download - скачивание файла книги
      Интерфейс книги:
      {
        id: "string",
        title: "string",
        description: "string",
        authors: "string",
        favorite: "string",
        fileCover: "string",
        fileName: "string",
        fileBook: "string"
      }
    `)
  }
)

module.exports = router;