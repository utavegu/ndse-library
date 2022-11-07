const express = require('express');

const router = express.Router();

router.post(
  '/',
  (_, responce) => {
    responce.status(201) // Что же мы создали в данном случае?..
    responce.json({ id: 1, mail: "test@mail.ru" })
  }
)

module.exports = router;