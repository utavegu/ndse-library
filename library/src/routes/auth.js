const express = require('express');
const router = express.Router();
const passport = require('passport');

const UsersController = require('../controllers/UsersController');

router.get('/', UsersController.renderHomePage)
router.get('/login', UsersController.renderLoginPage)
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  UsersController.signIn
)
router.get('/signup', UsersController.renderSignUpPage)
router.post('/signup', UsersController.signUp)
router.get('/logout', UsersController.logOut)

// TODO: Не нравится ми, после сдачи домашки сделать профайл
// TODO2: Подумать, как перенести в контроллер renderProfilePage
router.get('/me',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/user/login')
    }
    next()
  },
  (req, res) => {
    res.render('me', { user: req.user })
  }
)

module.exports = router;