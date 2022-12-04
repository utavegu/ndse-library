const db = require('./db.js');
const services = require('./services.js');
const activatePassport = require('./auth.js');

module.exports = {
  db, services, activatePassport
}