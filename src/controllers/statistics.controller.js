"use strict";

const { InvoiceModel, InvoiceDetailModel } = require('../models/invoice.model');
const { importModel, importDetailModel } = require('../models/import.model');

class StatisticsController {
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

        // Combine the data into one array with matching dates
        const combinedData = invoiceData.map((invoiceItem) => {
            const matchingImportItem = importData.find((importItem) => {
                return (
                    importItem._id.year === invoiceItem._id.year &&
                    importItem._id.month === invoiceItem._id.month &&
                    importItem._id.day === invoiceItem._id.day
                );
            });
            return {
                date: new Date(invoiceItem._id.year, invoiceItem._id.month - 1, invoiceItem._id.day),
                invoiceQuantity: invoiceItem.quantity,
                importQuantity: matchingImportItem ? matchingImportItem.quantity : 0
            }
        });

        res.render('statistics', { combinedData: combinedData });
    }
}

module.exports = new StatisticsController();