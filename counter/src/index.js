const express = require('express');
const redis = require('redis');

const app = express();

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get('/counter/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const cnt = await client.get(bookId);

  res.json({ counter: cnt });
})

app.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params;
  const cnt = await client.incr(bookId);

  res.json({ message: `Cчетчик книги: ${bookId} теперь равен: ${cnt}` });
})

app.listen(PORT, () => {
  console.log(`Сервер счетчика слушает на ${PORT} порту!`);
})