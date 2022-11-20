const User = require('../models/user');

module.exports = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username }).select('-__v');
    if (!user) {
      return done(null, false)
    } else {
      if (!(user.password === password)) {
        return done(null, false)
      }
      return done(null, user)
    }
  } catch (error) {
    return done(error)
  }
}