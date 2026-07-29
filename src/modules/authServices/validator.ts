// src/modules/authServices/validator.ts

import { z } from "zod";
import { UserType } from "@prisma/client";
import {
  userFields,
  emailValidator,
  passwordValidator,
} from "../../common/validator/common.validator";
// ---------------- Common Validators ----------------

// ---------------- Register ----------------

export const registerSchema = z.object({
  ...userFields,
  user_type: z.nativeEnum(UserType),
});

// ---------------- Login ----------------

export const loginSchema = z.object({
  email: emailValidator,
  passwordHash: passwordValidator,
});

// ---------------- Verify OTP ----------------

export const verifySchema = z.object({
  email: emailValidator,
  otp: z.string().min(1, { message: "OTP is required" }),
});

// ---------------- Change Password ----------------

export const chnagePasswordSchema = z
  .object({
    oldPasswordHash: passwordValidator,
    newPasswordHash: passwordValidator,
    confirmPasswordHash: passwordValidator,
  })
  .refine((data) => data.newPasswordHash === data.confirmPasswordHash, {
    path: ["confirmPasswordHash"],
    message: "New password and confirm password do not match",
  });

// ---------------- Device FCM ----------------

export const updateFcmTokenSchema = z.object({
  deviceId: z.string().trim().min(1, { message: "FCM Token is required" }),
  device_FCM_Id: z.string().trim().min(1, { message: "FCM Token is required" }),

  deviceName: z.string().trim().min(1, { message: "Device name is required" }),

  deviceType: z.string().trim().min(1, { message: "Device type is required" }),

  osVersion: z.string().trim().min(1, { message: "OS version is required" }),

  appVersion: z.string().trim().min(1, { message: "App version is required" }),

  ipAddress: z.string().trim().min(1, { message: "IP address is required" }),
});

export const logoutSchema = z.object({
  deviceId: z.string().trim().min(1, { message: "FCM Token is required" }),
});
// ---------------- Types ----------------

export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
export type ChangePasswordInput = z.infer<typeof chnagePasswordSchema>;
export type UpdateFcmTokenInput = z.infer<typeof updateFcmTokenSchema>;
export type LogOutInput = z.infer<typeof logoutSchema>;
