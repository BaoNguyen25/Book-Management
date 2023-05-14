'use strict';

const mongoose = require('mongoose');
const { Schema, Types, Model } = mongoose;

const InvoiceDetailSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
});

const InvoiceDetailModel = mongoose.model('invoiceDetail', InvoiceDetailSchema);

const InvoiceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    madeBy: {
        type: String,
        required: true
    },
    detail: {
        type: [InvoiceDetailSchema],
    },
    date: {
        type: Date,
        default: Date.now()
    }, 
    price: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const InvoiceModel = mongoose.model('invoice', InvoiceSchema);

module.exports = {
    InvoiceModel,
    InvoiceDetailModel,
    InvoiceDetailSchema,
    InvoiceSchema,
};