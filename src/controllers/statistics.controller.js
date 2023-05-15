"use strict";

const { InvoiceModel, InvoiceDetailModel } = require('../models/invoice.model');
const { importModel, importDetailModel } = require('../models/import.model');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

class StatisticsController {
    getStatisticsPage = async (req, res) => {
        res.render('statistics')
    };

    getStatistics = async (req, res) => {
        const invoiceData = await InvoiceModel.aggregate([{
                $unwind: "$detail"
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$date"
                        },
                        month: {
                            $month: "$date"
                        },
                        day: {
                            $dayOfMonth: "$date"
                        }
                    },
                    quantity: {
                        $sum: "$detail.quantity"
                    }
                }
            }
        ]);
        // Group the import details by date and sum the quantity
        const importData = await importModel.aggregate([{
            $unwind: "$detail"
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$date"
                    },
                    month: {
                        $month: "$date"
                    },
                    day: {
                        $dayOfMonth: "$date"
                    }
                },
                quantity: {
                    $sum: "$detail.quantity"
                }
            }
        }
        ]);

        const csvWriter = await createCsvWriter({
            path: __dirname + '../../../public/resources/data.csv',
            header: [
                { id: 'date', title: 'Date' },
                { id: 'invoiceQuantity', title: 'Invoice Quantity' },
                { id: 'importQuantity', title: 'Import Quantity' },
            ]
        });
        // Combine the data into one array with matching 
        var arr = [];
        
        const combinedData = invoiceData.map((invoiceItem) => {
            const matchingImportItem = importData.find((importItem) => {
                return (
                    importItem._id.year === invoiceItem._id.year &&
                    importItem._id.month === invoiceItem._id.month &&
                    importItem._id.day === invoiceItem._id.day
                );
            });

            const data = {
                date: new Date(invoiceItem._id.year, invoiceItem._id.month - 1, invoiceItem._id.day).toLocaleDateString("en-US"),
                invoiceQuantity: invoiceItem.quantity,
                importQuantity: matchingImportItem ? matchingImportItem.quantity : 0
            }

            arr.push(data);
        });

        arr.sort(function(a,b){
            return new Date(a.date) - new Date(b.date);
          });
        await csvWriter.writeRecords(arr)
        .then(() => {
            console.log('Đã xuất dữ liệu sang file CSV');
        });
        

        return combinedData ? res.status(200).json({
            message: 'Get statistics successfully',
        }): res.status(400).json({
            message: ' Get statistics failed'
        });    }
}

module.exports = new StatisticsController();