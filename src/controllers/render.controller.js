"use strict";

const { getBookList } = require("../services/book.service");

class RenderController {
    getSignIn = async (req, res) => {
        res.render('signIn');
    }

    getForgetPassword = async (req, res) => {
        res.render('forgetPassword');
    }

    getRecoverPassword = async (req, res) => {
        const { id } = req.params;
        res.render('recoverPassword', { userId: id });
    }

    getDashboard = async (req, res) => {
        res.render('dashboard');
    }

    getBookPage = async (req, res) => {
        res.render('dashboardBook', { bookList: await getBookList() });
    }
    
    getCategoryPage = async (reg, res) =>{
        res.render('dashboardCategory')
    }

    getAuthorPage = async (reg, res) =>{
        res.render('dashboardAuthor')
    }
}

module.exports = new RenderController();