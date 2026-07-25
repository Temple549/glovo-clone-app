import axios from "axios";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const paystackClient = {
  async initializeTransaction(email: string, amount: number, reference: string) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email,
          amount, // Paystack expects amount in kobo/minor units
          reference,
          callback_url: `${env.FRONTEND_URL}/checkout/verify`
        },
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new AppError(502, "PAYMENT_INITIALIZATION_FAILED", "Could not initialize payment with Paystack.");
    }
  },

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
          }
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new AppError(502, "PAYMENT_VERIFICATION_FAILED", "Could not verify payment with Paystack.");
    }
  }
};
