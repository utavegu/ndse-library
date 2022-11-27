const http = require('http');
const path = require('path');

const Book = require('../models/book');

const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001'; // TODO: В сетап джээс

class BooksTemplateController {

  async getAllBooksPage(_, responce) {
    try {
      const books = await Book.find().select('-__v')
      responce
        .status(200)
        .render("books/index", {
          title: "Библиотека",
          library: books,
        })
    } catch (error) {
      // В идеале техническую инфу пользователю отдавать не надо, а накидать шаблон странички для каждого из типов ошибок
      responce
        .status(500)
        .json(error)
    }
  }

  getCreateNewBookPage(_, responce) {
    responce.render("books/create", {
      title: "Создание книги",
      book: '', // ПОЧЕМУ ЭТО ВООБЩЕ РАБОТАЕТ?! (а без такого приема - не работает)
    })
  }

  async createNewBook(request, responce) {
    const newBook = new Book({ ...request.body, fileBook: request.file ? request.file.path : "" })
    try {
      await newBook.save()
      responce
        .status(201)
        .redirect('/books')
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }
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

  async deleteBook(request, responce) {
    const { id } = request.params
    try {
      await Book.deleteOne({ _id: id })
      responce
        .status(200)
        .redirect('/books');
    } catch (error) {
      responce
        .status(404)
        .redirect('/404')
    }
  }

  async getEditBookPage(request, responce) {
    const { id } = request.params
    try {
      const book = await Book.findById(id).select('-__v')
      responce
        .status(200)
        .render("books/update", {
          title: "Редактирование данных о книге",
          book,
        });
    } catch (error) {
      responce
        .status(404)
        .redirect('/404')
    }
  }

  async editBook(request, responce) {
    const { id } = request.params
    try {
      await Book.findByIdAndUpdate(
        id,
        // TODO: Вообще надо бы еще обработать ситуацию, что если книга уже была загружена, то не затирать путь до нее, если при редактировании поле было пустым
        { ...request.body, fileBook: request.file ? request.file.path : '' }
      )
      responce
        .status(301)
        .redirect(`/books/${id}`)
    } catch (error) {
      responce
        .status(404)
        .redirect('/404')
    }
  }

  async getTargetBookPage(request, responce) {
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
            // TODO: Это вроде асинхронщина и эвэйт тут лишним не будет, почитай на эту тему
            let parsedData = await JSON.parse(responceBody);
            let counter = parsedData.counter;
            // TODO: Это, вроде, можно одним запросом сделать
            await Book.findByIdAndUpdate(id, { $set: { counter: counter } })
            const book = await Book.findById(id).select('-__v')
            const user = request.user || {username: 'Гость'}
            responce
              .status(200)
              .render("books/view", {
                title: "Просмотр книги",
                book,
                user,
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
        .redirect('/404')
    }
  }

  // Только есть проблема, что такой способ к бесконечной загрузке приводит. Это, конечно, не правильно.
  protectBook(req, res, next) {
    if (!req.isAuthenticated()) {
      return console.log('Не достаточно прав для данного действия с книгой!')
    }
    next()
  }

}

module.exports = new BooksTemplateController();