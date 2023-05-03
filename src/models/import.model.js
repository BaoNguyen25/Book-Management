'use strict';

const mongoose = require('mongoose');
const { Schema, Types, Model } = mongoose;

const importDetailSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
});

const importDetailModel = mongoose.model('importDetail', importDetailSchema);

const importSchema = new Schema({
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
        type: [importDetailSchema],
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

const importModel = mongoose.model('import', importSchema);

module.exports = {
    importModel,
    importDetailModel,
    importDetailSchema,
    importSchema,
};