'use strict';

const { Book } = require('../models/book.model');

class AccessService {
    static async getBookList() {
        const bookList = await Book.find();

        return bookList;
    }

    static async addBook(name, category, author, quantity, price) {
        try {
            const book = await Book.create({
                name: name,
                category: category,
                author: author,
                quantity: quantity,
                price: price
            });
    
            return book ? book : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    static searchBook = (content="") => {
        return Book.aggregate([
            {
              $match: {
                $or: [
                    { name: { $regex: content, $options: 'i' } },
                    { category: { $regex: content, $options: 'i' } },
                    { author: { $regex: content, $options: 'i' } },
                ],
              },
            },
        ]).catch((error) => {
            console.log(error);
            return null;
        });
    };

    static async editBook (name, category, author, quantity, price) {
        let updateInfo = {};

        const fieldsToUpdate = [
            { key: 'name', value: name },
            { key: 'category', value: category },
            { key: 'author', value: author },
            { key: 'quantity', value: quantity },
            { key: 'price', value: price },
        ];
        
        for (const field of fieldsToUpdate) {
            if (field.value) {
                console.log(field.key, field.value);
                updateInfo[field.key] = field.value;
            }
        }

        return Book.findOneAndUpdate({ name: name }, updateInfo, { new: true }).catch((error) => {
            console.log(error);
            return null;
        });
    }

    static async deleteBook(name) {
        return Book.findOneAndDelete({ name: name }).catch((error) => {
            console.log(error);
            return null;
        });
    }
}

module.exports = AccessService;