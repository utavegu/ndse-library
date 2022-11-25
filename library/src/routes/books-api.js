const express = require('express');

// const http = require('http'); // Переедет в контроллер

const fileMulter = require('../middleware/upload-file');

const router = express.Router();

const BooksAPIController = require('../controllers/BooksAPIController');

// const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001';

router.get(
  '/',
  BooksAPIController.getAllBooks
);

/*
router.get(
  '/:id',
  (request, responce) => {
    const targetBookIndex = findBook(books, request)
    if (targetBookIndex !== -1) {
      const counterRequest = http.request(
        `${COUNTER_URL}/counter/${books[targetBookIndex].id}/incr`,
        {method: "POST"},
        (callback) => {
          let responceBody = '';
          callback.setEncoding("utf8");
          callback.on("data", (chunk) => {
            responceBody += chunk;
          })
          callback.on("end", () => {
            try {
              let parsedData = JSON.parse(responceBody);
              let counter = parsedData.counter;
              books[targetBookIndex].counter = counter;
              responce.json(books[targetBookIndex]);
            } catch (error) {
              console.error(error.message)
            }
          })
        }
      )
      counterRequest.end();
    } else {
      responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
    }
  }
)
*/

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
  BooksAPIController.protectBook,
  BooksAPIController.updateBook
);

router.delete(
  '/:id',
  BooksAPIController.protectBook,
  BooksAPIController.deleteBook
);

router.get(
  '/:id/download',
  BooksAPIController.downloadBook
)

module.exports = router;