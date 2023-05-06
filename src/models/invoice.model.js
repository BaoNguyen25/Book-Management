'use strict';

const mongoose = require('mongoose');
const { Schema, Types, Model } = mongoose;

const invoiceDetailSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
});

const invoiceDetailModel = mongoose.model('invoiceDetail', invoiceDetailSchema);

const invoiceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    madeBy: {
        type: String,
        required: true
    },
    detail: {
        type: [invoiceDetailSchema],
    },
    date: {
        type: Date,
        default: Date.now()
    }, 
}, {
    timestamps: true
});

const invoiceModel = mongoose.model('invoice', invoiceSchema);

module.exports = {
    invoiceModel,
    invoiceDetailModel,
    invoiceDetailSchema,
    invoiceSchema,
};