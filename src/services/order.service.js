"use strict";

const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");
const { addInvoice } = require("../services/invoice.service");

class OrderService {
  static getOrderListByStatus = async (status = "Pending") => {
    return await Order.find({ status })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "orderDetails.book",
        model: "Book",
      })
      .lean()
      .catch((err) => {
        return null;
      });
  };

  static searchOrder = async (name, status) => {
    try {
      const users = await User.find({
        name: { $regex: name, $options: "i" },
      }).lean();

      const userIds = users.map((user) => user._id);

      const orders = await Order.find({
        user: { $in: userIds },
        status: { $eq: status },
      })
        .populate({
          path: "user",
          model: "User",
        })
        .populate({
          path: "orderDetails.book",
          model: "Book",
        })
        .lean();

      return orders;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static finishOrder = async (orderId, madeBy) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        { status: "Delivered" }
      )
        .populate({
          path: "user",
          model: "User",
        })
        .populate({
          path: "orderDetails.book",
          model: "Book",
        });

      const orderDetails = order.orderDetails;

      const bookDetail = orderDetails.map((orderDetail) => {
        return {
          name: orderDetail.book.name,
          quantity: orderDetail.quantity,
        };
      });

      const username = order.user.name;
      const invoiceName = `Online-${username}-${Date.now()}`;

      const invoice = await addInvoice(
        invoiceName,
        bookDetail,
        Date.now(),
        madeBy
      );

      return invoice;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static cancelOrder = async (orderId) => {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId },
        { status: "Cancelled" }
      );

      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static getOrderCount = async () => {
    const orderCount = Order.countDocuments();
    return orderCount;
  };

  static getOrderSales = async () => {
    const orderSales = Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    return orderSales;
  };
}

module.exports = OrderService;
