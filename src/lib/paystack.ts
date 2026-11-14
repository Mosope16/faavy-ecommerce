import crypto from "crypto";

export interface PaystackInitParams {
  email: string;
  amountInKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      email: string;
      id: number;
      customer_code: string;
    };
    metadata?: Record<string, unknown>;
  };
}

export class PaystackService {
  private secretKey: string;

  constructor() {
    this.secretKey =
      process.env.PAYSTACK_SECRET_KEY || "sk_test_faavy_demo_secret_key_corporate";
  }

  /**
   * Initializes a transaction with Paystack on the server.
   */
  async initializeTransaction(
    params: PaystackInitParams
  ): Promise<PaystackInitResponse> {
    try {
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: params.email,
            amount: params.amountInKobo,
            reference: params.reference,
            callback_url: params.callbackUrl,
            metadata: params.metadata,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Paystack initialization error:", error);
      return {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to initialize Paystack payment",
      };
    }
  }

  /**
   * Server-side payment verification by reference.
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Paystack verification error:", error);
      return {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to verify Paystack payment",
      };
    }
  }

  /**
   * Verifies the cryptographic HMAC SHA512 signature of Paystack webhooks.
   */
  verifyWebhookSignature(signature: string, rawPayload: string): boolean {
    const webhookSecret =
      process.env.PAYSTACK_WEBHOOK_SECRET || this.secretKey;
    if (!signature || !webhookSecret) return false;

    const hash = crypto
      .createHmac("sha512", webhookSecret)
      .update(rawPayload)
      .digest("hex");

    return hash === signature;
  }
}

export const paystack = new PaystackService();
