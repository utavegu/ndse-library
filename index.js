const express = require('express');
const logger = require('./middleware/logger');
const error404 = require('./middleware/404');
const mainPageRouting = require('./routes/main')
const authRouting = require('./routes/auth');
const booksRouting = require('./routes/books');

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(logger);

app.use('/', mainPageRouting);
app.use('/api/user/login', authRouting);
app.use('/books', booksRouting);

app.use(error404);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
