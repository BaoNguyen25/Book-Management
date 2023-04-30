"use strict";

const router = require('express').Router();
const checkAuthen = require('../middleware/checkAuthen');

router.use('/access', require('./access/index'));

router.use(checkAuthen);

router.get('/', (req, res) => { res.redirect('/dashboard'); });

router.use('/dashboard', require('./dashboard/index'));

router.use('/book', require('./book/index'));

router.use('/author', require('./author/index'));

router.use('/category', require('./category/index'));

module.exports = router;