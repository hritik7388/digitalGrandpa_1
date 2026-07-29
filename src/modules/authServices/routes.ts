// src/modules/authServices/routes.ts

import { Router } from "express";
import { AuthController } from "./controller";
import {
  registerSchema,
  loginSchema,
  verifySchema,
  updateFcmTokenSchema, 
  logoutSchema,
} from "./validator";
import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware";

const authRouter = Router();
const authController = new AuthController();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post(
  "/register",
  validate(registerSchema),
  authController.registerUser,
);



/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and generate JWT
 * @access  Public
 */
authRouter.post("/login", validate(loginSchema), authController.loginUser);


/**
 * @route   POST /api/v1/auth/forget-password
 * @desc    Send password reset OTP to registered email
 * @access  Public
 */
authRouter.post("/forget-password", authController.forgetPassword);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify password reset OTP
 * @access  Public
 */
authRouter.post(
  "/verify-otp",
  validate(verifySchema),
  authController.verifyOtp,
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset account password
 * @access  Private
 */
authRouter.post("/reset-password", authenticate, authController.resetPassowrd);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change logged-in user's password
 * @access  Private
 */
authRouter.post(
  "/change-password",
  authenticate,
  authController.changePassword,
);

/**
 * @route   PUT /api/v1/auth/update-device
 * @desc    Register or update device FCM token
 * @access  Private
 */
authRouter.put(
  "/update-device",
  authenticate,
  validate(updateFcmTokenSchema),
  authController.updateDevice,
);




/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate active session
 * @access  Private
 */
authRouter.post(
  "/logout",
  authenticate,
  validate(logoutSchema),
  authController.logOut,
);

export default authRouter;
