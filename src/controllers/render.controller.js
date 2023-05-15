"use strict";

const { getBookList, getBookCount } = require("../services/book.service");
const { getAuthorList } = require("../services/author.service");
const { getCategoryList } = require("../services/category.service");
const { getImportList } = require("../services/import.service");
const { getEmployeeList } = require("../services/employee.service");
const { getInvoiceList } = require("../services/invoice.service");
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

        res.render('dashboard', 
        {books: await getBookCount(),
         orders: await getOrderCount(),
         sales: await getOrderSales(),
         isAdmin: admin,
        });
    }

    getBookPage = async (req, res) => {
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }       

        res.render('dashboardBook', 
        { bookList: await getBookList(),
          authorList: await getAuthorList(),
          categoryList: await getCategoryList(),
          isAdmin: admin,
        });
    }
    
    getCategoryPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        res.render('dashboardCategory', {categoryList: await getCategoryList(), isAdmin: admin})
    }

    getAuthorPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          

        res.render('dashboardAuthor', { 
        authorList: await getAuthorList(),
        isAdmin: admin, });
    }

    getImportPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        res.render('dashboardImport', { 
            bookList: await getBookList(),
            importList: await getImportList(),
            isAdmin: admin,
        });
    }

    getEmployeePage = async (req, res) =>{ 
        
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        
        res.render('dashboardEmployee', {
            employeeList: await getEmployeeList(),
            isAdmin: admin,
        });
        
    } 

    getInvoicePage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        res.render('dashboardInvoice', {
            bookList: await getBookList(),
            invoiceList: await getInvoiceList(),
            isAdmin: admin,
        });
    }

    getOrderPage = async (req, res) =>{
        var admin = false;
        if (req.user.role == 'Admin') {
            admin = true;
        }          
        res.render('dashboardOrder', {
            orderList: await getOrderListByStatus(),
            isAdmin: admin,
        });
    }
}

module.exports = new RenderController();