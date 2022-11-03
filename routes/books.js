const express = require('express');
const path = require('path');
const Book = require('../models/book');
const fakeDatabase = require('../data/fake-database');
const findBook = require('../utils/find-book');
const fileMulter = require('../middleware/upload-file');

const router = express.Router();

const { books } = fakeDatabase;

// Переход на страницу всей библиотеки
router.get(
  '/',
  (_, responce) => {
    responce.render("books/index", {
      title: "Библиотека",
      library: books,
    })
  }
);

// Переход на страницу создания книги
router.get(
  '/create',
  (_, responce) => {
    responce.render("books/create", {
      title: "Создание книги",
      book: '', // ПОЧЕМУ ЭТО ВООБЩЕ РАБОТАЕТ?! (а без такого приема - не работает)
    })
  }
);

// Переход на страницу просмотра выбранной книги
router.get(
  '/:id',
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex === -1) {
      responce.redirect('/404');
    }
    responce
      .render("books/view", {
        title: "Просмотр книги",
        book: books[targetBookIndex],
      })

  }
)

// Переход на страницу редактирования выбранной книги
router.get('/update/:id', (request, responce) => {
  const targetBookIndex = findBook(books, request)
  if (targetBookIndex === -1) {
    responce.redirect('/404');
  }
  responce.render("books/update", {
    title: "Редактирование данных о книге",
    book: books[targetBookIndex],
  });
});

// Добавление книги
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
        .redirect('/books');
    } else {
      responce
        .json({
          message: 'Не выбран файл для загрузки или неподходящий формат (используйте .txt, .doc, .docx или .pdf)'
        })
    }
  }
);

// Редактирование книги
router.post(
  '/:id',
  fileMulter.single('fileBook'),
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex === -1) {
      responce.redirect('/404');
    }
    books[targetBookIndex] = {
      ...books[targetBookIndex],
      ...request.body,
      fileBook: request.file ? request.file.path : ''
      // Такой себе способ, решил вопрос пока через реквайр. Но тогда не даст редактировать книгу, если поле с файлом книги проигнорировать. Тут думать надо как лучше, но это не в рамках данного задания, потому оставлю так.
    }
    responce
      .redirect('/books');
  }
)

// Удаление книги
router.post('/delete/:id', (request, responce) => {
  const targetBookIndex = findBook(books, request)
  if (targetBookIndex === -1) {
    responce.redirect('/404');
  }
  books.splice(targetBookIndex, 1);
  responce.redirect('/books');
});

// Скачивание книги
router.get(
  '/:id/download',
  (request, responce) => {
    const targetBookIndex = findBook(books, request);
    if (targetBookIndex === -1) {
      responce.redirect('/404');
    }
    const book = books[targetBookIndex];
    const errorHandler = (error) => {
      if (error) {
        responce
          .status(404)
          .json(error);
          // Тут бы тоже что-нибудь повменяемее. Я бы вообще убирал возможность скачивания, если book.fileBook пуская строка
      }
    }
    responce.download(book.fileBook, `${book.title}${path.extname(book.fileBook)}`, errorHandler);
  }
)

module.exports = router;
