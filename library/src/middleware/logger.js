const fs = require('fs');
const os = require('os');

module.exports = (request, _, next) => {
  const date = new Date().toISOString();
  const { url, method, headers } = request;
  const data = `Date: ${date}\nMethod: ${method}\nEndpoint: ${url}\nUser-Agent: ${headers['user-agent']}\n`;

  fs.appendFile("src/server.log", data + os.EOL, (error) => {
    if (error) throw error;
  });

  next();
};