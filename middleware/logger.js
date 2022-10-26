const fs = require('fs');
const os = require('os');

module.exports = (request, _, next) => {
  const date = new Date().toISOString();
  const { url, method } = request;

  const data = `Date: ${date}\nMethod: ${method}\nEndpoint: ${url}\n`;

  fs.appendFile("server.log", data + os.EOL, (error) => {
    if (error) throw error;
  });

  next();
};
