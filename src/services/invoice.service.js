'use strict';

const { InvoiceModel, InvoiceDetailModel } = require('../models/invoice.model');
const { Book } = require('../models/book.model');
const { compareBookDetails } = require('../helper/compareArray');

class InvoiceService {
    static addInvoice = async (name, bookDetail, date, madeBy) => {
        try {
            const bookDetailArr = bookDetail.map(book => {
                return new InvoiceDetailModel({
                    bookName: book.name,
                    quantity: book.quantity,
                });
            });
            
            let price = 0;
            for (let i = 0; i < bookDetail.length; i++) { 
                await Book.findOne({name: bookDetail[i].name}).then(book => {
                    price += book.price*bookDetail[i].quantity;
                })
                .catch(err => console.error(err));
            }

            const invoice = await InvoiceModel.create({
                name: name,
                detail: bookDetailArr,
                madeBy: madeBy,
                date: date,
                price: price,
            });

            for (let i = 0; i < bookDetail.length; i++) { 
                await Book.findOneAndUpdate({ name: bookDetail[i].name }, { $inc: { quantity: -bookDetail[i].quantity } });
            }

            return invoice;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static getInvoiceList = async () => {
        return await InvoiceModel.find().catch((err) => {return null});
    }

    static editInvoice = async (oldName, newName, bookDetail, date) => {
        try {
            const invoice = await InvoiceModel.findOne({ name: oldName });

            const curBookDetail = invoice.detail;
            const newBookDetail = compareBookDetails(curBookDetail, bookDetail);
            const newBookDetailArr = newBookDetail.map((book) => {
                return new InvoiceDetailModel({
                    bookName: book.bookName,
                    quantity: Math.abs(book.quantity),
                });
            });

            let price = 0;
            for (let i = 0; i < newBookDetail.length; i++) { 
                await Book.findOne({name: newBookDetail[i].bookName}).then(book => {
                    price += book.price*newBookDetail[i].quantity;
                })
                .catch(err => console.error(err));
            }
    
            const update = {
                name: newName,
                detail: newBookDetailArr,
                date: date,
                price: price,
            }

            
    
            const edited = await InvoiceModel.findOneAndUpdate({ name: oldName }, update);
    
            for (let i = 0; i < newBookDetail.length; i++) {
                const oldDetail = curBookDetail.find(item => item.bookName === newBookDetail[i].bookName);
                const incValue = oldDetail ? newBookDetail[i].quantity - oldDetail.quantity : newBookDetail[i].quantity;
                await Book.findOneAndUpdate(
                    {name: newBookDetail[i].bookName }, 
                    { $inc: { quantity: incValue }}
                    );
            }
    
            return edited;
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static deleteInvoice = async (name) => {
        try {
            const invoice = await InvoiceModel.findOne({name: name});

            const bookDetail = invoice.detail;

            const deleted = await InvoiceModel.findOneAndDelete({name: name});

            for (let i = 0; i < bookDetail.length; i++) {
                await Book.findOneAndUpdate({ name: bookDetail[i].bookName }, { $inc: { quantity: bookDetail[i].quantity } });
            }

            return deleted;
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static searchInvoice = async (content="") => {        
        return await InvoiceModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: content, $options: 'i' } },
                        { madeBy: { $regex: content, $options: 'i' } },
                    ]
                }
            },
        ]).catch((err) => {return null});
    }
}

module.exports = InvoiceService;