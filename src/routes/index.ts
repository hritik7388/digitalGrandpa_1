// src/routes/index.ts
import { Router } from "express";
import authRouter from "../modules/authServices/routes";
import userRouter from '../modules/userServices/routes'
import webhookRoutes from"./weebhookRoutes";
import orderRouter from "../modules/orderServices/routes";
import themeRouter from "../modules/themeServices/router";
import personalizeRouter from "../modules/personalizeServices/routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user",userRouter)
router.use("/webhooks", webhookRoutes);
router.use("/orders", orderRouter);
router.use("/themes", themeRouter);
router.use("/personalization", personalizeRouter);
export default router;
