const express = require('express');
const path = require('path');
const Book = require('../models/book');
const fakeDatabase = require('../data/fake-database');
const findBook = require('../utils/find-book');
const fileMulter = require('../middleware/upload-file')

const router = express.Router();

const { books } = fakeDatabase;

router.get(
  '/',
  (_, responce) => responce.json(books)
);

router.post(
  '/',
  (request, responce) => {
    const { id: requestID, title, description, authors, favorite, fileCover, fileName } = request.body;
    const newBook = new Book(requestID, title, description, authors, favorite, fileCover, fileName);
    books.push(newBook);
    responce
      .status(201)
      .json(newBook);
  }
);

// "Созданную Middleware подключить и обработать в роутах создания данных о книге." (с) Из задания. Не понимаю как это сделать именно так.
router.post(
  '/upload',
  fileMulter.single('book'), // Не особо понял что это за аргумент, который принимает single. И как с этим работать на фронтенде. Это какой-то объект, передаваемый с клиента, у которого ключ будет "атрибут single", а значение - загруженный файл?
  (req, res) => {
    if (req.file) {
      const { path } = req.file
      res.json({ path })
    }
    res.json() // Это точно корректный ответ? (взял из примера в лекции)
  })

router.get(
  '/:id',
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex !== -1) {
      responce.json(books[targetBookIndex]);
    } else {
      responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
    }
  }
)

router.put(
  '/:id',
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex !== -1) {
      books[targetBookIndex] = {
        ...books[targetBookIndex],
        ...request.body
      }
      responce.json(books[targetBookIndex]);
    } else {
      responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
    }
  }
)

router.delete(
  '/:id',
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex !== -1) {
      books.splice(targetBookIndex, 1);
      responce.json({ message: 'Данные о книге успешно удалены!' });
    } else {
      responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
    }
  }
)

router.get(
  '/:id/download',
  (request, responce) => {
    const targetBookIndex = findBook(books, request);
    if (targetBookIndex !== -1) {
      const book = books[targetBookIndex];
      const errorHandler = (error) => {
        if (error) {
          responce
            .status(404)
            .json(error);
        }
      }
      responce.download(book.fileBook, `${book.title}${path.extname(book.fileBook)}`, errorHandler);
    } else {
      responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
    }
  }
)

module.exports = router;
