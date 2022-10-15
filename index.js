const express = require('express');

const Book = require('./models/book');
const { endpoints } = require('./routes/endpoints');

const app = express();
app.use(express.json());

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


// Routing

// Псевдоавторизация
app.post(
  endpoints.fakeAuth,
  (_, responce) => {
    responce.status(201) // Что же мы создали в данном случае?..
    responce.json({ id: 1, mail: "test@mail.ru" })
  }
)

// Запрос всей библиотеки
app.get(
  endpoints.library,
  (_, responce) => {
    const { books } = fakeDatabase;
    responce.json(books);
  }
)

// Запрос информации об одной книге
app.get(
  endpoints.book,
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      responce.json(books[targetBookIndex]);
    } else {
      responce.status(404);
      responce.json('Такая книга не найдена!');
    }
  }
)

// Добавление новой книги
app.post(
  endpoints.library,
  (request, responce) => {
    const { books } = fakeDatabase;
    // Тут, вроде, как-то поизящнее можно было сделать, вместо того, чтобы такую батарею параметров доставать-передавать
    const { id: requestID, title, description, authors, favorite, fileCover, fileName } = request.body;
    const newBook = new Book(requestID, title, description, authors, favorite, fileCover, fileName);
    books.push(newBook);
    responce.status(201)
    responce.json(newBook)
  }
)

// Изменение данных о уже имеющейся в библиотеке книге
app.put(
  endpoints.book,
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      books[targetBookIndex] = {
        ...books[targetBookIndex],
        ...request.body
      }
      responce.json(books[targetBookIndex])
    } else {
      responce.status(404);
      responce.json('Такая книга не найдена!');
    }
  }
)

// Удаление данных о книге из библиотеки
app.delete(
  endpoints.book,
  (request, responce) => {
    const { books } = fakeDatabase;
    const { id: idFromRequest } = request.params;
    const targetBookIndex = books.findIndex(book => book.id === idFromRequest);
    if (targetBookIndex !== -1) {
      books.splice(targetBookIndex, 1)
      responce.json(true)
    } else {
      responce.status(404);
      responce.json('Такая книга не найдена!');
    }
  }
)

const PORT = process.env.PORT || 3001; // на 3000 у меня фронт обычно
app.listen(PORT);
