// src/modules/orderServices/service.ts
import { AppError, HttpStatus } from "../../common/errors";
import { OrderRepository } from "./repository";
export class OrderServices {
  private readonly repository: OrderRepository;  
  constructor(repository: OrderRepository) { 
    this.repository = repository;
  }
  async getOrderProducts(orderNumber: string) {
    const order = await this.repository.getOrderProducts(orderNumber);

    if (!order) {
      throw new AppError("Order not found", HttpStatus.NOT_FOUND);
    }

    return {
      message: "Order products fetched successfully",
      data: order,
    };
  }
}
