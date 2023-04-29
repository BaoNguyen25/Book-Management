'use strict';

const { addBook, searchBook, editBook, deleteBook } = require('../services/book.service');

class BookController {
    addBook = async (req, res, next) => {
        const { name, category, author, quantity, price } = req.body;

        console.log(name, category, author, quantity, price);

        const book = await addBook(name, category, author, quantity, price);

        if (book) {
            res.status(200).json({
                message: 'Add book successfully',
                book: book
            });
        } else {
            res.status(500).json({
                message: 'Add book failed'
            });
        }
    }

    searchBook = async (req, res, next) => {
        const { content } = req.body;

        const bookList = await searchBook(content);

        return bookList ? res.status(200).json({
            message: 'Search book successfully',
            metadata: bookList
        }) : res.status(500).json({
            message: 'Search book failed'
        });
    }

    editBook = async (req, res, next) => {
        let { name, category, author, quantity, price } = req.body;

        quantity = parseInt(quantity) < 0 ? undefined : parseInt(quantity);
        price = parseInt(price) < 0 ? undefined : parseInt(price);

        const book = await editBook(name, category, author, quantity, price);

        return book ? res.status(200).json({
            message: 'Edit book successfully',
            metadata: book
        }) : res.status(500).json({
            message: 'Edit book failed'
        });
    }

    deleteBook = async (req, res, next) => {
        let { name } = req.body;

        const book = await deleteBook(name);

        return book ? res.status(200).json({
            message: 'Delete book successfully',
        }) : res.status(500).json({
            message: 'Delete book failed'
        });
    }
}

module.exports = new BookController();