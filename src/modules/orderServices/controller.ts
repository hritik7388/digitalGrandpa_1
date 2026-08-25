// src/modules/orderServices/controller.ts

import { OrderRepository } from "./repository";
import { OrderServices } from "./service";
import { ApiResponse, catchAsync } from "../../common/utils";
export class OrderController {
  private readonly orderServices: OrderServices;
  constructor() {
    this.orderServices = new OrderServices(new OrderRepository());
  }

  getOrderProducts = catchAsync(async (req, res) => {
    const orderNumber = String(req.query.orderNumber);

    const result = await this.orderServices.getOrderProducts(orderNumber);

    ApiResponse.success(res, 200, result.message, result.data);
  });
}
