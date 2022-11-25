const Book = require('../models/book');

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

  async getBook(request, responce) {
    const { id } = request.params
    try {
      const book = await Book.findById(id).select('-__v')
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

  async createBook(request, responce) {
    const newBook = new Book(request.body)
    // TODO: А вот каунтер убирай при создании каким-нибудь способом, либо всегда 0 (что и будет, если его убрать, так как в модели дефолтное значение как раз 0)
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
    // TODO: ДОДЕЛАТЬ
    const { id } = request.params
    try {
      await Book.findByIdAndUpdate(id, request.body)
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
      return responce.json({message: 'У вас недостаточно правдля осуществления данной операции!'})
    }
    next()
  }

}

module.exports = new BooksController();