'use strict';

const router = require('express').Router();
const { addImport, editImport, deleteImport, searchImport } = require('../../controllers/import.controller');

router.post('/add', addImport);

router.post('/edit', editImport);

router.post('/delete', deleteImport);

router.post('/search', searchImport);

module.exports = router;