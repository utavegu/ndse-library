const express = require('express');
// const path = require('path');
// const http = require('http');

const Book = require('../models/book');
// const fileMulter = require('../middleware/upload-file');

const router = express.Router();

// const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001';

router.get('/', async (_, responce) => {
  try {
    const books = await Book.find().select('-__v')
    responce.json(books)
  } catch (error) {
    responce
      .status(500)
      .json(error)
  }
});

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

router.get('/:id', async (request, responce) => {
  const { id } = request.params
  try {
    const book = await Book.findById(id).select('-__v')
    responce.json(book)
  } catch (error) {
    responce
      .status(404)
      .json({ data: null, message: 'Такая книга не найдена!' });
  }
});

/*
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
*/

router.post('/', async (request, responce) => {
  const { title, description, authors, favorite, fileCover, fileName, fileBook } = request.body
  const newBook = new Book({ title, description, authors, favorite, fileCover, fileName, fileBook })
  try {
    await newBook.save()
    responce.json(newBook)
  } catch (error) {
    responce
      .status(500)
      .json(error)
  }
});

router.put('/:id', async (request, responce) => {
  const { id } = request.params
  try {
    await Book.findByIdAndUpdate(id, { ...request.body })
    responce.redirect(`/api/books/${id}`)
  } catch (e) {
    responce
        .status(404)
        .json({ data: null, message: 'Такая книга не найдена!' });
  }
});

router.delete('/:id', async (request, responce) => {
  const { id } = request.params
  try {
    await Book.deleteOne({ _id: id })
    responce.json({ message: `Книга успешно удалена!` })
  } catch (error) {
    responce
      .status(500)
      .json(error)
  }
});

/*
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
*/

module.exports = router;