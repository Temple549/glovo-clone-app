import IORedis from "ioredis";
import { Queue } from "bullmq";
import { env } from "../config/env.js";
import { emailService } from "../integrations/resend/email.service.js";
import { logger } from "../utils/logger.js";

let connection: IORedis | undefined;
if (env.REDIS_URL) {
  connection = new IORedis(env.REDIS_URL);
} else {
  logger.warn("REDIS_URL not set — email queue will run in-process");
}

export const emailQueue = new Queue("email", connection ? { connection } : {});

export async function enqueueEmail(to: string, subject: string, html: string) {
  if (!connection) {
    // Fallback: send immediately
    await emailService.sendEmail(to, subject, html);
    return;
  }

  await emailQueue.add("send-email", { to, subject, html });
}
