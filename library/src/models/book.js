const { v4: uuid } = require('uuid');

class Book {
  constructor(
    /**
     * Уникальный идентификатор книги, строка
     */
    id,
    /**
     * Название книги, строка
     */
    title = "Заголовок книги",
    /**
     * Краткое описание книги, строка
     */
    description = "Краткое описание книги",
    /**
     * Автор(ы) книги, строка
     */
    authors = "Автор(ы)",
    /**
     * Неизвестное поле 1, строка
     */
    favorite,
    /**
     * Неизвестное поле 2, строка
     */
    fileCover,
    /**
     * Неизвестное поле 3, строка
     */
    fileName,
    /**
     * Файл самой книги, строка
     */
    fileBook = '',
    /**
     * Количество просмотров книги
     */
    counter = '0'
  ) {
    this.id = id || uuid(); // Поленился вбить нормальный артикул - получи абракадабру
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite || "Не понятно что за поле";
    this.fileCover = fileCover || "Не понятно что за поле";
    this.fileName = fileName || "Не понятно что за поле"; // Это чтобы я не забывал, что так тоже можно (способ до появления ЕС6)
    this.fileBook = fileBook;
    this.counter = counter;
  }
};

module.exports = Book;