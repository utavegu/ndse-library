Задание 2

В файле README.md написать следующие запросы для MongoDB:

1) запрос(ы) для вставки данных минимум о двух книгах в коллекцию books,
2) запрос для поиска полей документов коллекции books по полю title,
3) запрос для редактирования полей: description и authors коллекции books по _id записи.

*Каждый документ коллекции books должен содержать следующую структуру данных:

{
  title: "string",
  description: "string",
  authors: "string"
}

1)
```
try {
   db.books.insertMany( [
      { title: "Виннипух", description: "Про свиней, ружья и пчёл. Боевик, драма.", authors: "Детский автор" },
      { title: "Мемуары геи" , description: "Толерантная жизнь всех цветов радуги.", authors: "Взрослый автор" }
   ] );
} catch (error) {
   print (error);
}
```

2)
```
db.books.find( { title: { $gt: "4" } } )
```

3)
```
try {
   db.books.updateOne(
      { id: { $lt: 1 } },
      { $set: { description: "Теперь ты другое описание.", authors: "И автор тоже поменялся. А заголовок - нет!"} }
   );
} catch (error) {
   print(error);
}
```
