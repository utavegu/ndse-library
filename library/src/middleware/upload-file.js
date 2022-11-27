const multer = require('multer');
const path = require('path');

// TODO: Малтер или нет, но русское имя книги зальется как абракадабра. И только имя, не контент.

const multerSetup = {
  destination(req, file, cb) {
    // TODO: __dirname и подобные получше изучить, полезные штуки.
    // Походу из-за контейнера стало иначе работать, дирнейм помог. Вероятно, кстати, и у логгера по этой же причине борода.
    cb(null, path.join(__dirname, '../books/'));
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
