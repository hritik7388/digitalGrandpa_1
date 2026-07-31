// src/routes/weebhookRoutes.ts

import { Router } from "express";
import {
  Prisma,
  PrismaClient,
  PaymentStatus,
  OrderStatus,
} from "@prisma/client";
import logger from "../config/logger";

const prisma = new PrismaClient();
const router = Router();

router.post("/orders-paid", async (req, res) => {
  try {
    const payload = req.body;

    await prisma.$transaction(async (tx) => {
      //----------------------------------------
      // ORDER
      //----------------------------------------

      const orderData = {
        orderNumber: payload.order_number.toString(),
        shopifyCustomerId: payload.customer?.id?.toString() ?? null,
        email: payload.email,
        currency: payload.currency,
        financialStatus: payload.financial_status,
        fulfillmentStatus: payload.fulfillment_status,
        subtotal: new Prisma.Decimal(payload.subtotal_price || 0),
        discount: new Prisma.Decimal(payload.total_discounts || 0),
        shippingCharge: new Prisma.Decimal(
          payload.total_shipping_price_set?.shop_money?.amount || 0
        ),
        tax: new Prisma.Decimal(payload.total_tax || 0),
        totalAmount: new Prisma.Decimal(payload.total_price || 0),
        paymentStatus:
          payload.financial_status === "paid"
            ? PaymentStatus.PAID
            : PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
      };

      await tx.order.upsert({
        where: {
          order_id: payload.id.toString(),
        },
        update: orderData,
        create: {
          order_id: payload.id.toString(),
          ...orderData,
        },
      });

      //----------------------------------------
      // ORDER ITEMS
      //----------------------------------------

      await tx.orderItem.deleteMany({
        where: {
          order_id: payload.id.toString(),
        },
      });

      if (payload.line_items?.length) {
        await tx.orderItem.createMany({
          data: payload.line_items.map((item: any) => ({
            item_id: item.id.toString(),
            order_id: payload.id.toString(),
            product_id: item.product_id?.toString() ?? null,
            variant_id: item.variant_id?.toString() ?? null,
            title: item.title,
            sku: item.sku,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
            productExists: item.product_exists,
          })),
        });
      }

      //----------------------------------------
      // BILLING ADDRESS
      //----------------------------------------

      if (payload.billing_address) {
        const billingAddress = {
          firstName: payload.billing_address.first_name,
          lastName: payload.billing_address.last_name,
          company: payload.billing_address.company,
          phone: payload.billing_address.phone,
          address1: payload.billing_address.address1,
          address2: payload.billing_address.address2,
          city: payload.billing_address.city,
          state: payload.billing_address.province,
          zip: payload.billing_address.zip,
          country: payload.billing_address.country,
          countryCode: payload.billing_address.country_code,
          provinceCode: payload.billing_address.province_code,
        };

        await tx.billingAddress.upsert({
          where: {
            order_id: payload.id.toString(),
          },
          update: billingAddress,
          create: {
            order_id: payload.id.toString(),
            ...billingAddress,
          },
        });
      }

      //----------------------------------------
      // SHIPPING ADDRESS
      //----------------------------------------

      if (payload.shipping_address) {
        const shippingAddress = {
          firstName: payload.shipping_address.first_name,
          lastName: payload.shipping_address.last_name,
          company: payload.shipping_address.company,
          phone: payload.shipping_address.phone,
          address1: payload.shipping_address.address1,
          address2: payload.shipping_address.address2,
          city: payload.shipping_address.city,
          state: payload.shipping_address.province,
          zip: payload.shipping_address.zip,
          country: payload.shipping_address.country,
          countryCode: payload.shipping_address.country_code,
          provinceCode: payload.shipping_address.province_code,
        };

        await tx.shippingAddress.upsert({
          where: {
            order_id: payload.id.toString(),
          },
          update: shippingAddress,
          create: {
            order_id: payload.id.toString(),
            ...shippingAddress,
          },
        });
      }
 

      await tx.shippingLine.deleteMany({
        where: {
          order_id: payload.id.toString(),
        },
      });

      if (payload.shipping_lines?.length) {
        await tx.shippingLine.createMany({
          data: payload.shipping_lines.map((line: any) => ({
            shipping_line_id: line.id.toString(),
            order_id: payload.id.toString(),
            title: line.title,
            price: new Prisma.Decimal(line.price),
          })),
        });
      }
    });

    return res.status(200).send("OK");
  } catch (error) {
    logger.error("Failed to process Shopify orders-paid webhook", error);

  return res.status(500).send("Internal Server Error");
  }
});

export default router;