// src/modules/orderServices/routes.ts

const { Router } = require("express");
const { OrderController } = require("./controller");

const orderRouter = Router();
const orderController = new OrderController();
/**
 * @route   GET /api/v1/order/orders/orderId
 * @desc    Get all products of an order
 * @access  Public
 */
orderRouter.get("/orderId", orderController.getOrderProducts);


export default orderRouter;