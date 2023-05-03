'use strict';

const { addImport, editImport, deleteImport, searchImport } = require('../services/import.service');

class ImportController {
    addImport = async (req, res) => {
        const { name, bookDetail, date } = req.body;

        const imported = await addImport(name, bookDetail, date, req.user.name);

        return imported ? res.json({ 
                message: 'Add import successfully',
                metadata: imported
            }) : res.json({ message: 'Add import failed' });
    }

    editImport = async (req, res) => {
        const { oldName, name, bookDetail, date } = req.body;

        const edited = await editImport(oldName, name, bookDetail, date);

        return edited ? res.json({
                message: 'Edit import successfully',
                metadata: edited
            }) : res.json({ message: 'Edit import failed' });
    }

    deleteImport = async (req, res) => {
        const { name } = req.body;

        const deleted = await deleteImport(name);

        return deleted ? res.json(
            { message: 'Delete import successfully' }) : 
            res.json({ message: 'Delete import failed' });
    }

    searchImport = async (req, res) => {
        const { content } = req.body;

        const imported = await searchImport(content);

        return imported ? res.json({
                message: 'Search import successfully',
                metadata: imported
            }) : res.json({ message: 'Search import failed' });

    }
}

module.exports = new ImportController();