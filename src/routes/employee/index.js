'use strict';

const router = require('express').Router();
const { addEmployee, editEmployee, deleteEmployee, searchEmployee } = require('../../controllers/employee.controller');

router.post('/add', addEmployee);

router.post('/edit', editEmployee);

router.post('/delete', deleteEmployee);

router.post('/search', searchEmployee);

module.exports = router;