// src/modules/personalizeServices/routes.ts
import { Router } from "express";

import { PersonalizationController } from "./controller";
import {
  createPersonalizationSchema,
  selectPersonalizationJokesSchema,
  uploadPersonalizationImageSchema,
} from "./validator";

import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware";

const personalizationRouter = Router();

const personalizationController = new PersonalizationController();

/**
 * @route   POST /api/v1/personalization
 * @desc    Create personalization
 * @access  Private
 */
personalizationRouter.post(
  "/",

  validate(createPersonalizationSchema),
  personalizationController.createPersonalization,
);

/**
 * @route   POST /api/v1/personalization/images
 * @desc    Upload personalization image
 * @access  Private
 */
personalizationRouter.post(
  "/images",

  validate(uploadPersonalizationImageSchema),
  personalizationController.uploadPersonalizationImage,
);

/**
 * Select / Unselect personalization jokes
 */
personalizationRouter.post(
  "/jokes",
  
  validate(selectPersonalizationJokesSchema),
  personalizationController.selectPersonalizationJokes,
);
export default personalizationRouter;
