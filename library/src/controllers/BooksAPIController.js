const http = require('http');
const path = require('path');

const Book = require('../models/book');

const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001'; // TODO: В сетап джээс

class BooksController {

  async getAllBooks(_, responce) {
    try {
      const books = await Book.find().select('-__v')
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

  getBook(request, responce) {
    const { id } = request.params
    try {
      const COUNTER_REQUEST_ENDPOINT = `${COUNTER_URL}/counter/${id}/incr`;
      const counterRequestSetup = { method: "POST" };
      const counterRequestCallback = (callback) => {
        let responceBody = '';
        callback.setEncoding("utf8");
        callback.on("data", (chunk) => {
          responceBody += chunk;
        })
        callback.on("end", async () => {
          try {
            let parsedData = await JSON.parse(responceBody);
            let counter = parsedData.counter;
            // TODO: Это, вроде, можно одним запросом сделать
            await Book.findByIdAndUpdate(id, { $set: { counter: counter } })
            const book = await Book.findById(id).select('-__v')
            responce
              .status(200)
              .json({
                success: true,
                data: book,
              })
          } catch (error) {
            console.error(error.message)
          }
        })
      }

      const counterRequest = http.request(
        COUNTER_REQUEST_ENDPOINT,
        counterRequestSetup,
        counterRequestCallback
      )

      counterRequest.end();

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

  async createBook(request, responce) {
    const newBook = new Book({ ...request.body, fileBook: request.file ? request.file.path : "", counter: "0" })
    try {
      await newBook.save()
      responce
        .status(201)
        .json({
          success: true,
          data: newBook,
        })
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }
  }

  async updateBook(request, responce) {
    const { id } = request.params
    try {
      // Тут тоже что-то не в восторге с двойного запроса...
      const book = await Book.findById(id).select('-__v')
      await Book.findByIdAndUpdate(
        id,
        { ...request.body, fileBook: request.file ? request.file.path : book.fileBook }
      )
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

  async deleteBook(request, responce) {
    const { id } = request.params
    try {
      await Book.deleteOne({ _id: id })
      responce
        .status(200)
        .json({
          success: true,
          message: `Книга успешно удалена!`
        })
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

  // Круто... только вот что мне в постмане/на фронте сделать нужно, чтобы прав было достаточно? TODO: Поиграйся с авторизацией в шаблонах и посмотри что происходит в кукисах и заголовках
  protectBook(request, responce, next) {
    if (!request.isAuthenticated()) {
      return responce.json({ message: 'У вас недостаточно правдля осуществления данной операции!' })
    }
    next()
  }

  async downloadBook(request, responce) {
    const { id } = request.params
    try {
      const book = await Book.findById(id).select('-__v')
      const downloadErrorHandler = (error) => {
        if (error) {
          responce
            .json(error);
        }
      }
      responce.download(
        book.fileBook,
        `${book.title}${path.extname(book.fileBook)}`,
        downloadErrorHandler
      );
    } catch (error) {
      responce
        .status(404)
        .redirect('/404')
    }
  }

}

module.exports = new BooksController();