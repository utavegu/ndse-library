const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const verify = require('../utils/verify');
const User = require('../models/user');

module.exports = () => {

  const options = {
    usernameField: "username",
    passwordField: "password",
  }

  passport.use('local', new LocalStrategy(options, verify))

  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await User.findById(id).select('-__v')
      cb(null, user)
    } catch (error) {
      return cb(error)
    }
  })

}