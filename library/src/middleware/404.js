module.exports = (_, responce) => {
  responce
    .status(404)
    // Вариант мидлвары для API:
    // .json({message: '404 | страница не найдена'});
    // Вариант при использовании шаблонизатора:
    .render('errors/404', {
      title: 'Ошибка 404 | страница не найдена'
    });
}