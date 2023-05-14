'use strict';

const { getOrderListByStatus, searchOrder, finishOrder, cancelOrder } = require('../services/order.service');

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

    finishOrder = async (req, res) => {
        const { orderId } = req.body;
        const userName = req.user.name;

        if (!orderId) {
            return res.status(400).json({
                message: 'Bad request'
            });
        }

        try {
            const done = await finishOrder(orderId, userName);

            console.log(done)

            return done ? res.status(200).json({
                message: 'Finish order successfully'
            }) : res.status(500).json({
                message: 'Finish order failed'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Finish order failed'
            });
        }
    }

    cancelOrder = async (req, res) => {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: 'Bad request'
            });
        }

        try {
            const done = await cancelOrder(orderId);

            return done ? res.status(200).json({
                message: 'Cancel order successfully'
            }) : res.status(500).json({
                message: 'Cancel order failed'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Cancel order failed'
            });
        }
    }
}

module.exports = new OrderController();