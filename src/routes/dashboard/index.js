'use strict';

const router = require('express').Router();
const { getDashboard, getBookPage, getCategoryPage, getAuthorPage } = require('../../controllers/render.controller');

router.get('/', getDashboard);

router.get('/book', getBookPage);

router.get('/category', getCategoryPage);

router.get('/author', getAuthorPage);

module.exports = router;

