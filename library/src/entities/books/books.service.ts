import { IBook, ICreateBookDto } from './book.interface';
import { BookModel } from './book.model';

export class BooksRepository {

  // создание книги
  async createBook(book: ICreateBookDto): Promise<IBook | Error> {
    const newBook = new BookModel(book)
    try {
      await newBook.save()
      return newBook;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  }

  // получение всех книг
  async getBooks(): Promise<IBook[] | Error> {
    try {
      const books = await BookModel.find().select('-__v')
      return books;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  }

  // получение книги по id
  async getBook(id: string): Promise<IBook | Error> {
    try {
      const book = await BookModel.findById(id).select('-__v')
      return book
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  }

  // обновление книги
  async updateBook(id: string, payload: ICreateBookDto): Promise<void | Error> {
    try {
      const book = await BookModel.findById(id).select('-__v')
      await BookModel.findByIdAndUpdate(
        id,
        { ...payload }
      )
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  }

  // удаление книги
  async deleteBook(id: string): Promise<string | null> {
    try {
      const book = await BookModel.findById(id).select('-__v')
      if (book) {
        await BookModel.deleteOne({ _id: id })
        return 'Книга успешно удалена!'
      } else {
        throw new Error
      }
    } catch (error) {
      return null
    }
  }

}
