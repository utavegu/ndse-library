const path = require('path');
const Book = require('../models/book');

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
      const book = await Book.findById(id).select('-__v')
      responce
        .status(200)
        .render("books/view", {
          title: "Просмотр книги",
          book,
        })
    } catch (error) {
      responce.redirect('/404')
    }
  }


}

module.exports = new BooksTemplateController();