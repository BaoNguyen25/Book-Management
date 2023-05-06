'use strict';

const { User } = require('../models/user.model');

class EmployeeService {
    static getEmployeeList = async () => {
        return await User.find().catch((err) => { return null; });
    }

    static addEmployee = async (id, name, gender, role, phone, address, identity, email) => {
        return await User.create({
            id: id,
            name: name,
            email: email,
            gender: gender,
            role: role,
            phone: phone,
            address: address,
            identity: identity
        }).catch((err) => { return null; });
    }

    static deleteEmployee = async (email) => {
        return await User.findOneAndDelete({ email: email }).catch((err) => { return null; });
    }

    static searchEmployee = async (content) => {
        return User.find({ name: { $regex: content, $options: 'i' } }).catch((err) => { return null });
    }

    static editEmployee = async (id, name, gender, role, phone, address, identity, email) => {
        try {
            const editedEmployee = {
                id: id,
                name: name,
                gender: gender,
                role: role,
                phone: phone,
                address: address,
                identity: identity
            }
            const edited = await User.findOneAndUpdate({ email: email }, editedEmployee);

            return edited;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

module.exports = EmployeeService;