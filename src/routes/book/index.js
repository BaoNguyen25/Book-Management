'use strict';

const router = require('express').Router();
const { addBook, searchBook, editBook, deleteBook } = require('../../controllers/book.controller');
const { upload } = require('../../config/config.multer');

router.post('/add', upload.single('image'), addBook);

router.post('/edit', upload.single('image') ,editBook);

router.post('/delete', deleteBook);

router.post('/search', searchBook);

module.exports = router;