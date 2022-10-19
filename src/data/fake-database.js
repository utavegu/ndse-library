const Book = require('../models/book');

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
    ),
    new Book(
      id = 'hobbitsy',
      title = 'Хоббиты',
      description = 'Мэджик сториз',
      authors = 'Толкиен',
      favorite = 'ХЗ',
      fileCover = 'ХЗ',
      fileName = 'ХЗ',
    ),
    new Book()
  ],
};

module.exports = fakeDatabase;