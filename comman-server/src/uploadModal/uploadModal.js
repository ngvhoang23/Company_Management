const multer = require("multer");
const path = require("path");

const storageUserAvatar = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./src/public/user_avatars/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadUserAvatar = multer({
  storage: storageUserAvatar,
});

const storageDocument = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./src/public/documents/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadDocument = multer({
  storage: storageDocument,
});

module.exports = { uploadUserAvatar, uploadDocument };
