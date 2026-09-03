// src/common/notification/workers/email.worker.ts
import { Worker } from "bullmq"; 
import { orderPersonalizationTemplate } from "../../templates/email/orderPersonalization";
import logger from "../../../config/logger";
import emailProvider from "../providers/email.provider";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "ORDER_PERSONALIZATION") {
      const {
        email,
        orderId,
        customerName,
      } = job.data;

      const html = orderPersonalizationTemplate(
        orderId,
        customerName,
      );

      await emailProvider.send({
        to: email,
        subject: "Personalize Your T-Shirt with AI 🎨",
        html,
      });

      logger.info(
        `Personalization email sent | orderId=${orderId} | email=${email}`,
      );
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  },
);

emailWorker.on("failed", (job, error) => {
  logger.error("Email job failed", {
    jobId: job?.id,
    error: error.message,
  });
});

export default emailWorker;