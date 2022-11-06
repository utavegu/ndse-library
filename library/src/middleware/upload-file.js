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

const allowedTypes = [
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/pdf'
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};


module.exports = multer({ storage, fileFilter });
