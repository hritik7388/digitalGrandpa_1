// src/modules/themeServices/router.ts
import { Router } from "express";
import { ThemeController } from "./controller";

const themeRouter = Router();
const themeController = new ThemeController();

/**
 * @route   GET /api/v1/themes
 * @desc    Get all active themes
 * @access  Public
 */
themeRouter.get("/", themeController.getAllThemes);

/**
 * @route   GET /api/v1/themes/themeId
 * @desc    Get active theme by ID
 * @access  Public
 */
themeRouter.get("/themeId", themeController.getThemeById);

export default themeRouter;
