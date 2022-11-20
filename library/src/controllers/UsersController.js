const User = require('../models/user');

// TODO: Нужны ли асинк-эвэйты, если нет обращения к базе?

class BooksController {

  renderHomePage(req, res) {
    res.render('home', { user: req.user })
  }

  renderLoginPage(_, res) {
    res.render('login')
  }

  signIn(_, res) {
    res.redirect('/user')
  }

  renderSignUpPage(_, res) {
    res.render('signup')
  }

  async signUp(req, res) {
    // неплохо бы еще проверять, что такого req.body.username уже нет в базе
    if (req.body.username && req.body.password && req.body.repeatPassword && req.body.password === req.body.repeatPassword) {
      const newUser = new User(req.body)
      // TODO: права библиотекаря - текущая дата +3 месяца
      try {
        await newUser.save()
        // По нормальному - редирект на страницу успешной регистрации и через 3 секунды с нее редирект на логина
        console.log("Регистрация прошла успешна, теперь вы можете залогиниться!");
        res
          .status(201)
          .redirect('/user/login');
      } catch (error) {
        res
          .status(500)
          .json(error)
      }
    } else {
      // В идеале тост
      console.log("Ошибка регистрации!");
      res.redirect('/user/signup');
    }
  }

  logOut(req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
    })
    res.redirect('/user')
  }

}

module.exports = new BooksController();