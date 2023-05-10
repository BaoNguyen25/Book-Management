'use strict';

const router = require('express').Router();
const { getStatistics } = require('../../controllers/statistics.controller');

router.get('/', getStatistics);

module.exports = router;
