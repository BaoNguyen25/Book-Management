'use strict';

const router = require('express').Router();
const { getDashboard, getBookPage, getCategoryPage, 
    getAuthorPage, getImportPage, getEmployeePage, getInvoicePage,
    getOrderPage } = require('../../controllers/render.controller');

router.get('/', getDashboard);

router.get('/book', getBookPage);

router.get('/category', getCategoryPage);

router.get('/author', getAuthorPage);

router.get('/import', getImportPage);

router.get('/employee', getEmployeePage);

router.get('/invoice', getInvoicePage);

router.get('/order', getOrderPage);

module.exports = router;

