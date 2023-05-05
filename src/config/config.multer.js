const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
};

