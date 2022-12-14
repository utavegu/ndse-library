const User = require('../models/user');

class UsersController {

  renderHomePage(req, res) {
    res.render('user/home', { user: req.user })
  }

  renderLoginPage(_, res) {
    res.render('user/login')
  }

  signIn(_, res) {
    res.redirect('/user')
  }

  renderSignUpPage(_, res) {
    res.render('user/signup')
  }

  async signUp(req, res) {
    // TODO: неплохо бы еще проверять, что такого req.body.username уже нет в базе
    if (req.body.username && req.body.password && req.body.repeatPassword && req.body.password === req.body.repeatPassword) {
      const newUser = new User(req.body)
      // TODO: права библиотекаря - текущая дата +3 месяца
      try {
        await newUser.save()
        // TODO: По нормальному - редирект на страницу успешной регистрации и через 3 секунды с нее редирект на логина
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

  checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/user/login')
    }
    next()
  }

  renderProfilePage(req, res) {
    res.render('user/profile', { user: req.user })
  }

}

module.exports = new UsersController();