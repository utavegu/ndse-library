const express = require('express');
const logger = require('./middleware/logger');
const error404 = require('./middleware/404');
const authRouting = require('./routes/auth');
const booksRouting = require('./routes/books');

const app = express();
app.use(express.json());

app.use(logger);

app.use('/api/user/login', authRouting);
app.use('/api/books', booksRouting);

app.use(error404);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
