'use strict';

const router = require('express').Router();
const { getStatistics } = require('../../controllers/statistics.controller');

router.get('/data', getStatistics);

module.exports = router;
