// src/modules/orderServices/repository.ts
import prisma from "../../config/prisma";

// src/modules/orderServices/repository.ts
export class OrderRepository {
  getOrderProducts = async (orderNumber: string) => {
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber,
      },
      select: {
        order_id: true,
        orderNumber: true,

        orderItems: {
          select: {
            item_id: true,
            product_id: true,
            variant_id: true,
            title: true,
            variantTitle: true,
            image: true,
            quantity: true,
            currentQuantity: true,
            fulfillableQuantity: true,
            price: true,
            sku: true,
          },
        },
      },
    });

    return order;
  };
}
