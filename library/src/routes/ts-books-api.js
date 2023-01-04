const router = require('express').Router();
const fileMulter = require('../middleware/upload-file');
// const BooksAPIController = require('../controllers/BooksAPIController');
const BooksRepository = require('../classes/BooksRepository');
const IoCContainer = require( "../container");

// const BooksRepositoryInstance = new BooksRepository();
const repo = IoCContainer.get(BooksRepository)

router.post(
  '/',
  // BooksAPIController.protectBook,
  fileMulter.single('fileBook'),
  // Двойные асинк-эвэйты и трай-кетчи
  async (request, responce) => {
    try {
      // const newBook = await BooksRepositoryInstance.createBook(request.body)
      const newBook = await repo.createBook(request.body)
      // А без таких извращений как-то можно?
      const convertedNewBook = JSON.parse(JSON.stringify(newBook))
      const fullBook = {
        ...convertedNewBook,
        fileBook: request.file ? request.file.path : "",
        counter: "0"
      }
      responce
        .status(201)
        .json({
          success: true,
          data: fullBook,
        })
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }
  }
);

router.get(
  '/',
  async (_, responce) => {
    try {
      // const books = await BooksRepositoryInstance.getBooks();
      const books = await repo.getBooks();
      responce
        .status(200)
        .json({
          success: true,
          data: books,
          quantity: books.length,
        })
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }

  }
);

router.get(
  '/:id',
  async (request, responce) => {
    const { id } = request.params
    try {
      // const book = await BooksRepositoryInstance.getBook(id);
      const book = await repo.getBook(id);
      if (book === null) throw new Error;
      responce
        .status(200)
        .json({
          success: true,
          data: book,
        })
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: 'Такая книга не найдена!',
        });
    }
  }
);

router.put(
  '/:id',
  // BooksAPIController.protectBook,
  fileMulter.single('fileBook'),
  (request, responce) => {
    try {
      const { id } = request.params;
      const payload = request.body;
      const file = request.file;
      // В общем тут я вынужден маленько отойти от ТЗ. Непонятно как обновлять книгу без новых данных и видимо то что у меня тут есть работа с файлом в ТЗ тоже не учитывалось.
      // BooksRepositoryInstance.updateBook(id, payload, file)
      repo.updateBook(id, payload, file)
      responce
        .status(301)
        .redirect(`/api/books/${id}`)
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: 'Такая книга не найдена!'
        });
    }
  }
);

router.delete(
  '/:id',
  // BooksAPIController.protectBook,
  async (request, responce) => {
    const { id } = request.params;
    try {
      // const result = await BooksRepositoryInstance.deleteBook(id);
      const result = await repo.deleteBook(id);
      if (!result) throw new Error("Такая книга не найдена!");
      responce
        .status(200)
        .json({
          success: true,
          message: result
        })
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: error.message
        });
    }
  }
);

module.exports = router;