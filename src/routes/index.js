"use strict";

const router = require('express').Router();
const checkAuthen = require('../middleware/checkAuthen');

router.use('/access', require('./access/index'));

// router.use(checkAuthen);

router.get('/', (req, res) => { res.redirect('/dashboard'); });

router.use('/dashboard', require('./dashboard/index'));

router.use('/book', require('./book/index'));

router.use('/author', require('./author/index'));

router.use('/category', require('./category/index'));

router.use('/import', require('./import/index'));

router.use('/employee', require('./employee/index'));

router.use('/order', require('./order/index'));

router.use('/invoice', require('./invoice/index'));

router.use('/statistics', require('./statistics/index'));

module.exports = router;