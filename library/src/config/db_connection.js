// файл бесовщины... и подключается в индексе тоже как бесовщина... почему это всё вообще работает...
const mongoose = require('mongoose');
const config = require('.');

const { connectionUrl, user, password, database } = config.db

  ; (async () => {
    mongoose.connection
      .on('error', err => {
        logError(err); // что за logError?
        console.error(err);
      })
      .on('connected', () => {
        console.log(`Подключение к базе данных ${database} произведено успешно!`);
      });

    await mongoose.connect(connectionUrl, {
      user: user,
      pass: password,
      dbName: database,
    });
  })()
