const Book = require('../models/book');

// 1) Можно ли в этом пути опустить public?
// 2) Когда пользователь создает данные о новой книге - ему нужно прямо весь вот этот путь передавать? Как-то очень не юзабилити
const bookshelf = 'public/books/';

const fakeDatabase = {
  books: [
    new Book(
      id = 'lukomorie',
      title = 'Лукоморье',
      description = 'Про котов и русалок',
      authors = 'Пушкин',
      favorite = 'ХЗ',
      fileCover = 'ХЗ',
      fileName = 'ХЗ',
      fileBook = bookshelf + 'book1.txt'
    ),
    new Book(
      id = 'hobbitsy',
      title = 'Хоббиты',
      description = 'Мэджик сториз',
      authors = 'Толкиен',
      favorite = 'ХЗ',
      fileCover = 'ХЗ',
      fileName = 'ХЗ',
      fileBook = bookshelf + 'book2.txt'
    ),
    new Book()
  ],
};

module.exports = fakeDatabase;