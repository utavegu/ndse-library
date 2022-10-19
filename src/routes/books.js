const express = require('express');
const Book = require('../models/book');
const fakeDatabase = require('../data/fake-database');

const router = express.Router();

// Запрос всей библиотеки
router.get(
  '/',
  (_, responce) => {
    const { books } = fakeDatabase;
    responce.json(books);
  }
);

// Добавление новой книги
router.post(
  '/',
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: requestID, title, description, authors, favorite, fileCover, fileName } = request.body;
    const newBook = new Book(requestID, title, description, authors, favorite, fileCover, fileName);
    books.push(newBook);
    responce
      .status(201)
      .json(newBook);
  }
);

// Запрос информации об одной книге
router.get(
  '/:id',
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      responce.json(books[targetBookIndex]);
    } else {
      responce
        .status(404)
        .json({data: null, message: 'Такая книга не найдена!'});
    }
  }
)

// Изменение данных о уже имеющейся в библиотеке книге
router.put(
  '/:id',
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      books[targetBookIndex] = {
        ...books[targetBookIndex],
        ...request.body
      }
      responce.json(books[targetBookIndex]);
    } else {
      responce
        .status(404)
        .json({data: null, message: 'Такая книга не найдена!'});
    }
  }
)

// Удаление данных о книге из библиотеки
router.delete(
  '/:id',
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      books.splice(targetBookIndex, 1);
      responce.json({message: 'Данные о книге успешно удалены!'});
    } else {
      responce
        .status(404)
        .json({data: null, message: 'Такая книга не найдена!'});
    }
  }
)

module.exports = router;
