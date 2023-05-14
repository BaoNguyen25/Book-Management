'use strict';

const { Order } = require('../models/order.model');
const { User } = require('../models/user.model');

class OrderService {
    static getOrderListByStatus = async (status='Pending') => {
        return await Order.find({status}).populate({
            path: 'user',
            model: 'User'
        })
        .populate({
            path: 'orderDetails.book',
            model: 'Book'
        }).
        lean().catch((err) => { return null; });
    }

    static searchOrder = async (name, status) => {
        try {
          const users = await User.find({ name: { $regex: name, $options: 'i' } }).lean();
      
          const userIds = users.map((user) => user._id);
      
          const orders = await Order.find({
            user: { $in: userIds },
            status: { $eq: status },
          })
            .populate({
              path: 'user',
              model: 'User',
            })
            .populate({
              path: 'orderDetails.book',
              model: 'Book',
            })
            .lean();
      
          return orders;
        } catch (error) {
          console.log(error);
          return null;
        }
      }

      static getOrderCount = async () => {
        const orderCount = Order.countDocuments();
        return orderCount;
      }

      
      static getOrderSales = async () => {
        const orderSales =  Order.aggregate([
          {
              $group: {
                  _id: null,
                  total: { $sum: "$total" }
              }
          }
      ]);
        return orderSales;
      }

      
}

module.exports = OrderService;