"use strict";

const { getBookList, getBookCount } = require("../services/book.service");
const { getAuthorList } = require("../services/author.service");
const { getCategoryList } = require("../services/category.service");
const { getImportList } = require("../services/import.service");
const { getEmployeeList } = require("../services/employee.service");
const { getInvoiceList, getInvoiceSales } = require("../services/invoice.service");
const { getOrderListByStatus, getOrderCount, getOrderSales} = require("../services/order.service");

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
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;

        res.render('dashboard', 
        {books: await getBookCount(),
         orders: await getOrderCount(),
         sales: await getInvoiceSales(),
         isAdmin: admin,
         name: name,
        });
    }

    getBookPage = async (req, res) => {
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }       
        const { name } = req.user;

        res.render('dashboardBook', 
        { bookList: await getBookList(),
          authorList: await getAuthorList(),
          categoryList: await getCategoryList(),
          isAdmin: admin,
          name: name,
        });
    }
    
    getCategoryPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;

        res.render('dashboardCategory', {categoryList: await getCategoryList(), isAdmin: admin, name: name,})
    }

    getAuthorPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;

        res.render('dashboardAuthor', { 
            authorList: await getAuthorList(),
            isAdmin: admin, 
            name: name,
        });
    }

    getImportPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }       
        const { name } = req.user;

        res.render('dashboardImport', { 
            bookList: await getBookList(),
            importList: await getImportList(),
            isAdmin: admin,
            name: name,
        });
    }

    getEmployeePage = async (req, res) =>{ 
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;
        
        res.render('dashboardEmployee', {
            employeeList: await getEmployeeList(),
            isAdmin: admin,
            name: name,
        });
        
    } 

    getInvoicePage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;

        res.render('dashboardInvoice', {
            bookList: await getBookList(),
            invoiceList: await getInvoiceList(),
            isAdmin: admin,
            name: name,
        });
    }

    getOrderPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        const { name } = req.user;

        res.render('dashboardOrder', {
            orderList: await getOrderListByStatus(),
            isAdmin: admin,
            name: name,
        });
    }
}

module.exports = new RenderController();