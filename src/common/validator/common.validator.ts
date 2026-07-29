// src/common/validator/common.validator.ts
import { z } from "zod";

export const nameValidator = (field: string) =>
  z.string().trim().min(2, {
    message: `${field} must be at least 2 characters`,
  });

export const emailValidator = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" });

export const passwordValidator = z
  .string()
  .trim()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" });

export const mobileValidator = z
  .string()
  .trim()
  .min(1, { message: "Mobile Number is required" });

export const countryCodeValidator = z
  .string()
  .trim()
  .min(1, { message: "Country Code is required" });

export const imageValidator = z
  .string()
  .trim()
  .url("Invalid image URL");

export const userFields = {
  firstName: nameValidator("First Name"),
  lastName: nameValidator("Last Name"),
  email: emailValidator,
  passwordHash: passwordValidator,
  mobileNumber: mobileValidator,
  countryCode: countryCodeValidator,
};