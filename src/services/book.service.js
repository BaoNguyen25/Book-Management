'use strict';

const { Book } = require('../models/book.model');
const { Author } = require('../models/author.model');
const { Category } = require('../models/category.model');

const { uploadImage, deleteImage, editImage } = require('../utils/uploadImageFirebase')

const fs = require('fs');

class AccessService {
    static getBookList = async () => {
        const bookList = await Book.find().catch((error) => {
            console.log(error);
            return null;
        });

        return bookList;
    }

    static addBook = async (name, category, author, quantity, image, price) => {
        try {
            const imageUrl = await uploadImage(image, name);

            if (!imageUrl) throw new Error('Upload image failed');

            const book = await Book.create({
                name: name,
                category: category,
                author: author,
                quantity: quantity,
                image: imageUrl,
                price: price
            });
    
            return book ? book : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    static searchBook = async (content="") => {
        return await Book.aggregate([
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

    static editBook = async (oldName, name, category, author, quantity, image, price) => {
        let updateInfo = {};

        const fieldsToUpdate = [
            { key: 'name', value: name },
            { key: 'category', value: category },
            { key: 'author', value: author },
            { key: 'quantity', value: quantity },
            { key: 'image', value: image },
            { key: 'price', value: price },
        ];
        
        for (const field of fieldsToUpdate) {
            if (field.value) {
                updateInfo[field.key] = field.value;
            }
        }  

        try {
            const book = await Book.findOne({ name: oldName });
            const curAuthor = book.author;
            const curCategory = book.category;

            if (image) {
                const updateLink = await editImage(image, oldName);

                if (!updateLink) throw new Error('Upload image failed');

                updateInfo['image'] = updateLink;
            }

            const editedBook = await Book.findOneAndUpdate({ name: oldName }, updateInfo, { new: true });
            
            if (curAuthor != author) {
                await Author.findOneAndUpdate({ name: curAuthor, products: { $gte: 1 } }, 
                    { $inc: {products : -1} });

                await Author.findOneAndUpdate({ name: author },
                    { $inc: {products : 1} });
            }

            if (curCategory != category) {
                await Category.findOneAndUpdate({ name: curCategory, products: { $gte: 1 } },
                    { $inc: {products : -1} });
                
                await Category.findOneAndUpdate({ name: category },
                    { $inc: {products : 1} });
            }

            return editedBook;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static deleteBook = async (name) => {
        try {
            const book = await Book.findOne({ name: name }).catch((error) => {
                console.log(error);
                return null;
            });
    
            if (!book) return null;
    
            const imageUrl = book.image;
    
            const fileName = imageUrl.split('%2F')[1].split('?')[0].trim();
                        
            await deleteImage(fileName);
    
            return await Book.findOneAndDelete({ name: name })
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = AccessService;