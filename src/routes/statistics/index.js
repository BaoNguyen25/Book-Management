'use strict';

const router = require('express').Router();
const { getStatistics, getStatisticsPage } = require('../../controllers/statistics.controller');

router.get('/data', getStatistics);
router.get('/', getStatisticsPage);


module.exports = router;