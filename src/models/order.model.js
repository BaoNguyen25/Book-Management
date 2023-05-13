'use strict';

const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const orderDetailSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    book: {
        type: String,
        required: true,
        ref: 'Book'
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const OrderDetail = model('OrderDetail', orderDetailSchema);

const orderSchema = new Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    orderDetails: {
        type: [orderDetailSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipping', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Order = model('Order', orderSchema);

module.exports = {
    OrderDetail,
    orderDetailSchema,
    Order,
    orderSchema
}