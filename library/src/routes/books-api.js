const express = require('express');

const fileMulter = require('../middleware/upload-file');

const router = express.Router();

const BooksAPIController = require('../controllers/BooksAPIController');

router.get(
  '/',
  BooksAPIController.getAllBooks
);

router.get(
  '/:id',
  BooksAPIController.getBook
);

router.post(
  '/',
  // BooksAPIController.protectBook,
  fileMulter.single('fileBook'),
  BooksAPIController.createBook
);

router.put(
  '/:id',
  // BooksAPIController.protectBook,
  fileMulter.single('fileBook'),
  BooksAPIController.updateBook
);

router.delete(
  '/:id',
  // BooksAPIController.protectBook,
  BooksAPIController.deleteBook
);

router.get(
  '/:id/download',
  BooksAPIController.downloadBook
)

module.exports = router;