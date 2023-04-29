'use strict';

const mongoose = require('mongoose');
const { Schema, Model, Types } = mongoose;

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        ref: 'Author',
    },
    category: {
        type: String,
        ref: 'Category',
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {
    bookSchema,
    Book
}