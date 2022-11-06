module.exports = (_, responce) => {
  responce
    .status(404)
    .json({message: '404 | страница не найдена'});
}