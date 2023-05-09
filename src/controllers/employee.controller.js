'use strict';

const { addEmployee, editEmployee, deleteEmployee, searchEmployee } = require('../services/employee.service')

class EmployeeController {
    addEmployee = async (req, res, next) => {
        const {name, gender, role, phone, address, identity, email} = req.body;

        const employee = await addEmployee(name, gender, role, phone, address, identity, email);
        return employee ? res.status(200).json({
            message: 'Add employee successfully',
            metadata: employee
        }): res.status(400).json({
            message: 'Add employee failed'
        });
    }

    editEmployee = async (req, res, next) => {
        const {name, gender, role, phone, address, identity, email} = req.body;

        const employee = await editEmployee(name, gender, role, phone, address, identity, email);

        return employee ? res.status(200).json({
            message: 'Edit employee successfully',
            metadata: employee
        }) : res.status(500).json({
            message: 'Edit employee failed'
        });
    }

    deleteEmployee = async (req, res, next) => {
        const { email } = req.body;

        const employee = await deleteEmployee(email);

        return employee ? res.status(200).json({
            message: 'Delete employee successfully',
        }): res.status(400).json({
            message: 'Delete employee failed'
        });
    }

    searchEmployee = async (req, res, next) => {
        const { content } = req.body;

        const employees = await searchEmployee(content);

        return employees ? res.status(200).json({
            message: 'Search employee successfully',
            metadata: employees
        }): res.status(400).json({
            message: 'Search employee failed'
        });
    }
}

module.exports = new EmployeeController();