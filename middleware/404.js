module.exports = (_, responce) => {
  responce
    .status(404)
    .render('errors/404', {
      title: 'Ошибка 404 | страница не найдена'
  })
}