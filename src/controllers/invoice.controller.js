'use strict';

const { addInvoice, editInvoice, deleteInvoice, searchInvoice } = require('../services/invoice.service');

class InvoiceController {
    addInvoice = async (req, res) => {
        const { name, bookDetail, date } = req.body;

        const invoice = await addInvoice(name, bookDetail, date, req.user.name);

        return invoice ? res.json({ 
                message: 'Add invoice successfully',
                metadata: invoice
            }) : res.json({ message: 'Add invoice failed' });
    }

    editInvoice = async (req, res) => {
        const { oldName, name, bookDetail, date } = req.body;

        const edited = await editInvoice(oldName, name, bookDetail, date);

        return edited ? res.json({
                message: 'Edit invoice successfully',
                metadata: edited
            }) : res.json({ message: 'Edit invoice failed' });
    }

    deleteInvoice = async (req, res) => {
        const { name } = req.body;

        const deleted = await deleteInvoice(name);

        return deleted ? res.json(
            { message: 'Delete invoice successfully' }) : 
            res.json({ message: 'Delete invoice failed' });
    }

    searchInvoice = async (req, res) => {
        const { content } = req.body;

        const invoice = await searchInvoice(content);

        return invoice ? res.json({
                message: 'Search invoice successfully',
                metadata: invoice
            }) : res.json({ message: 'Search invoice failed' });

    }
}

module.exports = new InvoiceController();