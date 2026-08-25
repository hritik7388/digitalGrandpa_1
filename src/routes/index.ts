// src/routes/index.ts
import { Router } from "express";
import authRouter from "../modules/authServices/routes";
import userRouter from '../modules/userServices/routes'
import webhookRoutes from"./weebhookRoutes";
import orderRouter from "../modules/orderServices/routes";
import themeRouter from "../modules/themeServices/router";

const router = Router();

router.use("/auth", authRouter);
router.use("/user",userRouter)
router.use("/webhooks", webhookRoutes);
router.use("/orders", orderRouter);
router.use("/themes", themeRouter);
export default router;
