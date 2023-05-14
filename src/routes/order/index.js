'use strict';

const router = require('express').Router();

const { searchOrder, finishOrder, cancelOrder } = require('../../controllers/order.controller');

router.post('/search', searchOrder);

router.post('/finish', finishOrder);

router.post('/cancel', cancelOrder);

module.exports = router;