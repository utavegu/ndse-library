const express = require('express');

const fileMulter = require('../middleware/upload-file');
const BooksTemplateController = require('../controllers/BooksTemplateController');

const router = express.Router();

// Отрисовка страницы всех книг
router.get(
  '/',
  BooksTemplateController.getAllBooksPage
);

// Переход на страницу создания книги
router.get(
  '/create',
  // BooksTemplateController.protectBook,
  BooksTemplateController.getCreateNewBookPage
);

// Добавление книги
router.post(
  '/',
  fileMulter.single('fileBook'),
  BooksTemplateController.createNewBook
);

// Скачивание книги
router.get(
  '/:id/download',
  BooksTemplateController.downloadBook
)

// Удаление книги
router.post(
  '/delete/:id',
  // BooksTemplateController.protectBook,
  BooksTemplateController.deleteBook
);

// Переход на страницу редактирования выбранной книги
router.get(
  '/update/:id',
  // BooksTemplateController.protectBook,
  BooksTemplateController.getEditBookPage
);

// Редактирование книги
router.post(
  '/:id',
  fileMulter.single('fileBook'),
  BooksTemplateController.editBook
)

// Переход на страницу выбранной книги
// Тебе надо быть в самом низу, иначе не дашь дорогу другим роутам. Это только так решается, или есть что-то типа Реакт-роутеровского экзакта?
router.get(
  '/:id',
  BooksTemplateController.getTargetBookPage
)

module.exports = router;