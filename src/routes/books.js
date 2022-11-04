const express = require('express');
const path = require('path');
const Book = require('../models/book');
const fakeDatabase = require('../data/fake-database');
const findBook = require('../utils/find-book');
const fileMulter = require('../middleware/upload-file');

const router = express.Router();

const { books } = fakeDatabase;

router.get(
  '/',
  (_, responce) => responce.json(books)
);

router.post(
  '/',
  fileMulter.single('fileBook'),
  (request, responce) => {
    if (request.file) {
      const { path } = request.file
      const { id: requestID, title, description, authors, favorite, fileCover, fileName } = request.body;
      const newBook = new Book(requestID, title, description, authors, favorite, fileCover, fileName, path);
      books.push(newBook);
      responce
        .status(201)
        .json(newBook);
    } else {
      responce
        .json({
          message: 'Не выбран файл для загрузки или неподходящий формат (используйте .txt, .doc, .docx или .pdf)'
        })
    }
  }
);

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