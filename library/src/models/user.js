const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  accessOpenUntil: String,
})

module.exports = model('User', userSchema)