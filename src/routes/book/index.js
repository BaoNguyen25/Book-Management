'use strict';

const router = require('express').Router();
const { addBook, searchBook, editBook, deleteBook } = require('../../controllers/book.controller');

router.post('/add', addBook);

router.post('/edit', editBook);

router.post('/delete', deleteBook);

router.post('/search', searchBook);

module.exports = router;