// src/common/notification/queues/email.queue.ts
import { Queue } from "bullmq";

const emailQueue = new Queue("email-queue", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

export default emailQueue;