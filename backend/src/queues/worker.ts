import IORedis from "ioredis";
import { Worker, Job } from "bullmq";
import { env } from "../config/env.js";
import { emailService } from "../integrations/resend/email.service.js";
import { logger } from "../utils/logger.js";

let worker: Worker | null = null;

export function startEmailWorker() {
  if (!env.REDIS_URL) {
    logger.warn("REDIS_URL not configured — email worker not started");
    return;
  }

  const connection = new IORedis(env.REDIS_URL);

  worker = new Worker(
    "email",
    async (job: Job) => {
      const { to, subject, html } = job.data as {
        to: string;
        subject: string;
        html: string;
      };

      await emailService.sendEmail(to, subject, html);
    },
    { connection, concurrency: 5 }
  );

  worker.on("completed", (job: Job) => {
    logger.info({ jobId: job.id }, "Email job completed");
  });

  worker.on("failed", (job: Job | undefined, err: Error) => {
    logger.error({ jobId: job?.id, err }, "Email job failed");
  });

  logger.info("Email worker started");
}

export function stopEmailWorker() {
  if (worker) {
    void worker.close();
    worker = null;
  }
}
