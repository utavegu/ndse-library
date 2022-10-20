const multer = require('multer');

const multerSetup = {
  destination(req, file, cb) {
    cb(null, 'public/books');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
};

const storage = multer.diskStorage(multerSetup);

module.exports = multer({ storage });
