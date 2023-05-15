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
        res.render('dashboard', 
        {books: await getBookCount(),
         orders: await getOrderCount(),
         sales: await getOrderSales(),
        });
    }

    getBookPage = async (req, res) => {
        res.render('dashboardBook', 
        { bookList: await getBookList(),
          authorList: await getAuthorList(),
          categoryList: await getCategoryList() 
        });
    }
    
    getCategoryPage = async (reg, res) =>{
        res.render('dashboardCategory', {categoryList: await getCategoryList()})
    }

    getAuthorPage = async (reg, res) =>{
        res.render('dashboardAuthor', { authorList: await getAuthorList() });
    }

    getImportPage = async (reg, res) =>{
        res.render('dashboardImport', { 
            bookList: await getBookList(),
            importList: await getImportList(),
        });
    }

    getEmployeePage = async (req, res) =>{ 
        
        // if (req.user.role == 'Admin') {
        //     function myFunction() {
        //         alert("You dont have permission to access on this site");
        //     }
        //     myFunction();
        // } else {
            res.render('dashboardEmployee', {
                employeeList: await getEmployeeList(),
        });
        
    } 

    getInvoicePage = async (reg, res) =>{
        res.render('dashboardInvoice', {
            bookList: await getBookList(),
            invoiceList: await getInvoiceList(),
        });
    }

    getOrderPage = async (reg, res) =>{
        res.render('dashboardOrder', {
            orderList: await getOrderListByStatus()
        });
    }
}

module.exports = new RenderController();