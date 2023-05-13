'use strict';

const { getOrderListByStatus, searchOrder } = require('../services/order.service');

class OrderController {
    searchOrder = async (req, res) => {
        try {
            const { name, status } = req.body;

            const orderList = await searchOrder(name, status);

            return orderList ? res.status(200).json({
                message: 'Search order successfully',
                metadata: orderList
            }) : res.status(500).json({
                message: 'Search order failed'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Search order failed'
            });
        }
    }
}

module.exports = new OrderController();