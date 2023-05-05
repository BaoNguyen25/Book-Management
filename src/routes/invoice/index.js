'use strict';

const router = require('express').Router();
const { addInvoice, editInvoice, deleteInvoice, searchInvoice } = require('../../controllers/invoice.controller');

router.post('/add', addInvoice);

router.post('/edit', editInvoice);

router.post('/delete', deleteInvoice);

router.post('/search', searchInvoice);

module.exports = router;