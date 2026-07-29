// src/modules/userServices/validator.ts
import { z } from "zod";
const nameValidator = (field: string) =>
  z.string().min(2, {
    message: `${field} must be at least 2 characters`,
  });

const emailValidator = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" });

const passwordValidator = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" });

const mobileValidator = z
  .string()
  .min(1, { message: "Mobile Number is required" });

const countryCodeValidator = z
  .string()
  .min(1, { message: "Country Code is required" });
const userFields = {
  firstName: nameValidator("First Name"),
  lastName: nameValidator("Last Name"),
  email: emailValidator,
  passwordHash: passwordValidator,
  mobileNumber: mobileValidator,
  countryCode: countryCodeValidator,
};
export const imageValidator = z.string().url("Invalid image URL");
export const updateProfileSchema = z
  .object({
    firstName: userFields.firstName.optional(),
    lastName: userFields.lastName.optional(),
    fullName: z.string().optional(),

    mobileNumber: mobileValidator.optional(),

    countryCode: countryCodeValidator.optional(),

    dateOfBirth: z.coerce.date().optional(),

    gender: z.string().optional(),

    profileImage: imageValidator.optional(),

    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    addressLine1: z
      .string()
      .trim()
      .max(255, {
        message: "Address Line 1 cannot exceed 255 characters",
      })
      .optional(),

    addressLine2: z
      .string()
      .trim()
      .max(255, {
        message: "Address Line 2 cannot exceed 255 characters",
      })
      .optional(),

    city: z
      .string()
      .trim()
      .max(100, {
        message: "City cannot exceed 100 characters",
      })
      .optional(),

    state: z
      .string()
      .trim()
      .max(100, {
        message: "State cannot exceed 100 characters",
      })
      .optional(),

    country: z
      .string()
      .trim()
      .max(100, {
        message: "Country cannot exceed 100 characters",
      })
      .optional(),

    postalCode: z
      .string()
      .trim()
      .max(20, {
        message: "Postal code cannot exceed 20 characters",
      })
      .optional(),

    latitude: z
      .number({
        message: "Latitude must be a number",
      })
      .min(-90, {
        message: "Latitude must be between -90 and 90",
      })
      .max(90, {
        message: "Latitude must be between -90 and 90",
      })
      .optional(),

    longitude: z
      .number({
        message: "Longitude must be a number",
      })
      .min(-180, {
        message: "Longitude must be between -180 and 180",
      })
      .max(180, {
        message: "Longitude must be between -180 and 180",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the profile.",
  });

export type UpdateUserInput = z.infer<typeof updateProfileSchema>;
