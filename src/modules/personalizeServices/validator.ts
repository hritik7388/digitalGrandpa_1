// src/modules/personalizeServices/validator.ts
import { z } from "zod";

export const createPersonalizationSchema = z.object({
  product_id: z
    .string()
    .trim()
    .min(1, { message: "Product ID is required" }),

  theme_id: z
    .string()
    .trim()
    .min(1, { message: "Theme ID is required" }),

  forWhom: z
    .string()
    .trim()
    .min(1, { message: "For whom is required" }),

  order_id: z
    .string()
    .trim()
    .min(1, { message: "Order ID is required" }),
}); 

export const uploadPersonalizationImageSchema = z.object({
  product_id: z
    .string()
    .trim()
    .min(1, { message: "Product ID is required" }),

  filename: z
    .string()
    .trim()
    .min(1, { message: "Filename is required" }),

  contentType: z
    .string()
    .trim()
    .min(1, { message: "Content type is required" }),
});


export const selectPersonalizationJokesSchema = z.object({
  product_id: z
    .string()
    .trim()
    .min(1, { message: "Product ID is required" }),

  joke_ids: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: "Joke ID is required" }),
    )
    .min(5, {
      message: "Minimum 5 jokes must be selected",
    }),
});

export type SelectPersonalizationJokesInput = z.infer<
  typeof selectPersonalizationJokesSchema
>;


export type UploadPersonalizationImageInput = z.infer<
  typeof uploadPersonalizationImageSchema
>;
export type CreatePersonalizationInput = z.infer<
  typeof createPersonalizationSchema
>;