// src/routes/index.ts
import { Router } from "express";
import authRouter from "../modules/authServices/routes";
import userRouter from '../modules/userServices/routes'

const router = Router();

router.use("/auth", authRouter);
router.use("/user",userRouter)

export default router;
