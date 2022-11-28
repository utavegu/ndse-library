const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "Название книги",
  },
  description: {
    type: String,
    required: true,
    default: "Краткое описание книги",
  },
  authors: {
    type: String,
    required: true,
    default: "Автор(-ы)",
  },
  favorite: {
    type: String,
    default: "Избранное",
  },
  fileCover: {
    type: String,
    default: "Обложка книги",
  },
  fileName: {
    type: String,
    default: "Имя скачиваемого файла книги",
  },
  fileBook: {
    type: String,
    default: "Путь до книги для скачивания",
  },
  counter: {
    type: String,
    default: "0",
  },
  feedbacks: {
    type: Array,
    default: [],
  }
})

module.exports = model('Book', bookSchema)