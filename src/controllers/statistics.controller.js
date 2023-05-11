"use strict";

const { InvoiceModel, InvoiceDetailModel } = require('../models/invoice.model');
const { importModel, importDetailModel } = require('../models/import.model');

class StatisticsController {
<<<<<<< HEAD
    getStatisticsPage = async (req, res) => {
        res.render('statistics')
    };

=======
>>>>>>> 30a48de6f862ecfa610f81e91dd221afef50deef
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
                date: "2",
                invoiceQuantity: invoiceItem.quantity,
                importQuantity: matchingImportItem ? matchingImportItem.quantity : 0
            }
        });

        return combinedData ? res.status(200).json({
            combinedData: combinedData
        }): res.status(400).json({
            message: ' Get statistics failed'
        });    }
}

module.exports = new StatisticsController();