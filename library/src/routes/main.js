const express = require('express');

const router = express.Router();

router.get(
  '/',
  (_, responce) => {
    responce.render("main")
  }
)

module.exports = router;