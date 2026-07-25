import axios from "axios";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const RESEND_API_URL = "https://api.resend.com/emails";

export const emailService = {
  async sendEmail(to: string, subject: string, html: string) {
    if (!env.RESEND_API_KEY) {
      logger.warn("Resend API key missing. Skipping email sending.");
      return;
    }

    try {
      await axios.post(
        RESEND_API_URL,
        {
          from: env.EMAIL_FROM || "onboarding@resend.dev",
          to,
          subject,
          html,
        },
        {
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      logger.info({ to, subject }, "Email sent successfully");
    } catch (error: any) {
      // Log failure but do not throw, to prevent breaking the main application flow
      logger.error({ err: error, to, subject }, "Failed to send email via Resend");
    }
  },
};
