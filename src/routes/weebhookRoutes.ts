// src/routes/weebhookRoutes.ts

import { Router } from "express";
import {
  Prisma,
  PrismaClient,
  PaymentStatus,
  OrderStatus,
} from "@prisma/client";
import axios from "axios";
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

        confirmationNumber: payload.confirmation_number,
        email: payload.email,
        contactEmail: payload.contact_email,

        currency: payload.currency,
        presentmentCurrency: payload.presentment_currency,

        financialStatus: payload.financial_status,
        fulfillmentStatus: payload.fulfillment_status,

        customerLocale: payload.customer_locale,
        sourceName: payload.source_name,

        subtotal: new Prisma.Decimal(payload.subtotal_price || 0),

        totalLineItemsPrice: new Prisma.Decimal(
          payload.total_line_items_price || 0,
        ),

        discount: new Prisma.Decimal(payload.total_discounts || 0),

        shippingCharge: new Prisma.Decimal(
          payload.total_shipping_price_set?.shop_money?.amount || 0,
        ),

        tax: new Prisma.Decimal(payload.total_tax || 0),

        totalAmount: new Prisma.Decimal(payload.total_price || 0),

        totalOutstanding: new Prisma.Decimal(
          payload.total_outstanding || 0,
        ),

        totalTipReceived: new Prisma.Decimal(
          payload.total_tip_received || 0,
        ),

        totalWeight: payload.total_weight || 0,

        paymentGatewayNames: payload.payment_gateway_names ?? [],

        test: payload.test ?? false,

        note: payload.note,
        tags: payload.tags,

        shopifyCreatedAt: payload.created_at
          ? new Date(payload.created_at)
          : null,

        shopifyProcessedAt: payload.processed_at
          ? new Date(payload.processed_at)
          : null,

        shopifyUpdatedAt: payload.updated_at
          ? new Date(payload.updated_at)
          : null,

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
        const orderItems = await Promise.all(
          payload.line_items.map(async (item: any) => {
            let productImage: string | null = null;

            //----------------------------------------
            // GET SHOPIFY PRODUCT IMAGE
            //----------------------------------------

            if (item.product_id) {
              try {
                const response = await axios.get(
                  `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2026-07/products/${item.product_id}.json`,
                  {
                    headers: {
                      "X-Shopify-Access-Token":
                        process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
                    },
                  },
                );

                productImage =
                  response.data.product?.images?.[0]?.src ?? null;

                logger.info(
                  `Shopify product image fetched | productId=${item.product_id} | image=${productImage}`,
                );
              } catch (error: any) {
                logger.error(
                  `Failed to fetch Shopify product image | productId=${item.product_id} | error=${error.message}`,
                );
              }
            }

            //----------------------------------------
            // ORDER ITEM
            //----------------------------------------

            return {
              item_id: item.id.toString(),

              order_id: payload.id.toString(),

              product_id: item.product_id?.toString() ?? null,
              variant_id: item.variant_id?.toString() ?? null,

              title: item.title,
              variantTitle: item.variant_title,

              sku: item.sku,

              quantity: item.quantity,
              currentQuantity: item.current_quantity,
              fulfillableQuantity: item.fulfillable_quantity,

              price: new Prisma.Decimal(item.price),

              image: productImage,

              grams: item.grams,
              vendor: item.vendor,

              fulfillmentService: item.fulfillment_service,
              fulfillmentStatus: item.fulfillment_status,

              productExists: item.product_exists,

              giftCard: item.gift_card,
              requiresShipping: item.requires_shipping,
              taxable: item.taxable,
            };
          }),
        );

        await tx.orderItem.createMany({
          data: orderItems,
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

      //----------------------------------------
      // SHIPPING LINES
      //----------------------------------------

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
  } catch (error: any) {
    logger.error(
      `Failed to process Shopify orders-paid webhook | ${error.message}`,
    );

    return res.status(500).send("Internal Server Error");
  }
});

export default router;