'use strict';

const router = require('express').Router();

const { searchOrder } = require('../../controllers/order.controller');

router.post('/search', searchOrder);

module.exports = router;