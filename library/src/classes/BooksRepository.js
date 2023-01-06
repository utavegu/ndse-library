// const http = require('http');
// const path = require('path');
require('reflect-metadata');
const { decorate, injectable } = require('inversify');

const Book = require('../models/book');

// const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3001';

class BooksRepository {

  // создание книги
  async createBook(book) {
    const newBook = new Book(book)
    try {
      await newBook.save()
      return newBook;
    } catch (error) {
      return error;
    }
  }

  // получение всех книг
  async getBooks() {
    try {
      const books = await Book.find().select('-__v')
      return books;
    } catch (error) {
      return error;
    }
  }

  // получение книги по id
  async getBook(id) {
    // возвращает андефайн, если с каунтером
    // const COUNTER_REQUEST_ENDPOINT = `${COUNTER_URL}/counter/${id}/incr`;
    // const counterRequestSetup = { method: "POST" };
    // const counterRequestCallback = (callback) => {
    //   let responceBody = '';
    //   callback.setEncoding("utf8");
    //   callback.on("data", (chunk) => {
    //     responceBody += chunk;
    //   })
    //   callback.on("end", async () => {
    try {
      // let parsedData = await JSON.parse(responceBody);
      // let counter = parsedData.counter;
      // TODO: Это, вроде, можно одним запросом сделать
      // await Book.findByIdAndUpdate(id, { $set: { counter: counter } })
      const book = await Book.findById(id).select('-__v')
      return book
    } catch (error) {
      return error
    }
    //   })
    // }

    // const counterRequest = http.request(
    //   COUNTER_REQUEST_ENDPOINT,
    //   counterRequestSetup,
    //   counterRequestCallback
    // )

    // counterRequest.end();
  }

  // обновление книги
  async updateBook(id, payload, file) {
    try {
      // TODO: Можно ли как-то без двойного запроса в базу?
      const book = await Book.findById(id).select('-__v')
      await Book.findByIdAndUpdate(
        id,
        { ...payload, fileBook: file ? file.path : book.fileBook }
      )
    } catch (error) {
      return error
    }
  }

  // удаление книги
  async deleteBook(id) {
    try {
      const book = await Book.findById(id).select('-__v')
      if (book) {
        await Book.deleteOne({ _id: id })
        return 'Книга успешно удалена!'
      } else {
        throw new Error
      }
    } catch (error) {
      return null
    }
  }

}

decorate(injectable(), BooksRepository)

module.exports = BooksRepository;