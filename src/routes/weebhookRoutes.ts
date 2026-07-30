// src/routes/weebhookRoutes.ts
import { Router } from "express";

const router = Router();

router.post("/orders-paid", async (req, res) => {
  try {
    console.log("=========== SHOPIFY WEBHOOK ===========");
    console.log(JSON.stringify(req.body, null, 2));

    return res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

export default router;