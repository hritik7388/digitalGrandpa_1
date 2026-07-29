// src/modules/userServices/routes.ts

import { Router } from "express";
import { UserController } from "./controller";

import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware";
import { updateProfileSchema } from "./validator";

const authRouter = Router();
const userController = new UserController();
/**
 * @route   GET /api/v1/user/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
authRouter.get("/profile", authenticate, userController.getUserProfile);

/**
 * @route   PUT /api/v1/user/change-profile
 * @desc    Update user profile image
 * @access  Private
 */
authRouter.put("/change-profile", authenticate, userController.changeProfile);

/**
 * @route   PUT /api/v1/user/update-profile
 * @desc    Update user profile details
 * @access  Private
 */
authRouter.put(
  "/update-profile",
  authenticate,
  validate(updateProfileSchema),
  userController.updateUser,
);

/**
 * @route   GET /api/v1/user/get-profile
 * @desc    Get user profile image/avatar
 * @access  Private
 */
authRouter.get("/get-profile", authenticate, userController.getAvtar);

export default authRouter;
