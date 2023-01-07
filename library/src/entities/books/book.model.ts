import { Schema, model, Document } from 'mongoose';
import { IBook } from './book.interface';

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
    type: [String],
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
  }
})

export const BookModel = model<IBook & Document>('Book', bookSchema)