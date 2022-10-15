const { v4: uuid } = require('uuid');

/*
Interface:
{
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: "string",
  fileCover: "string",
  fileName: "string"
}
*/

class Book {
  constructor(
    id,
    title = "Заголовок книги",
    description = "Краткое описание книги",
    authors = "Автор(ы)",
    favorite,
    fileCover,
    fileName
  ) {
    this.id = id || uuid(); // Поленился вбить нормальный артикул - получи абракадабру
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite || "Не понятно что за поле";
    this.fileCover = fileCover || "Не понятно что за поле";
    this.fileName = fileName || "Не понятно что за поле"; // Это чтобы я не забывал, что так тоже можно (способ до появления ЕС6)
  }
};

module.exports = Book;
