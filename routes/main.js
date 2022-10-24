const express = require('express');

const router = express.Router();

router.get(
  '/',
  (_, responce) => {
    responce
      .status(301) // Я ж 301 говорю, почему 302?
      .redirect('/books');
  }
)

module.exports = router;
