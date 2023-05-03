'use strict';

const { importModel, importDetailModel } = require('../models/import.model');
const { Book } = require('../models/book.model');
const { compareBookDetails } = require('../helper/compareArray');

class ImportService {
    static addImport = async (name, bookDetail, date, madeBy) => {
        try {
            const bookDetailArr = bookDetail.map(book => {
                return new importDetailModel({
                    bookName: book.name,
                    quantity: book.quantity,
                });
            });
    
            const imported = await importModel.create({
                name: name,
                detail: bookDetailArr,
                madeBy: madeBy,
                date: date,
            });

            for (let i = 0; i < bookDetail.length; i++) { 
                await Book.findOneAndUpdate({ name: bookDetail[i].name }, { $inc: { quantity: bookDetail[i].quantity } });
            }

            return imported;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static getImportList = async () => {
        return await importModel.find().catch((err) => {return null});
    }

    static editImport = async (oldName, newName, bookDetail, date) => {
        try {
            const imported = await importModel.findOne({ name: oldName });

            const curBookDetail = imported.detail;
            const newBookDetail = compareBookDetails(curBookDetail, bookDetail);
            const newBookDetailArr = newBookDetail.map((book) => {
                return new importDetailModel({
                    bookName: book.bookName,
                    quantity: Math.abs(book.quantity),
                });
            });
    
            const update = {
                name: newName,
                detail: newBookDetailArr,
                date: date,
            }
    
            const edited = await importModel.findOneAndUpdate({ name: oldName }, update);
    
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

    static deleteImport = async (name) => {
        try {
            const imported = await importModel.findOne({name: name});

            const bookDetail = imported.detail;

            const deleted = await importModel.findOneAndDelete({name: name});

            for (let i = 0; i < bookDetail.length; i++) {
                await Book.findOneAndUpdate({ name: bookDetail[i].bookName }, { $inc: { quantity: -bookDetail[i].quantity } });
            }

            return deleted;
        } catch(err) {
            console.log(err);
            return null;
        }
    }

    static searchImport = async (content="") => {        
        return await importModel.aggregate([
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

module.exports = ImportService;