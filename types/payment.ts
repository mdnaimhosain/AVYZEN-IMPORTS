import { Order, PaymentStatus } from "./database";

export interface CreatePaymentSessionParams {
  order: Order;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string | null;
  };
  redirectUrls: {
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
  };
}

export interface PaymentSessionResult {
  success: boolean;
  provider: string;
  transactionId?: string;
  paymentUrl?: string; // Redirect URL for hosted gateway checkout
  errorMessage?: string;
  requiresRedirect: boolean;
}

export interface VerifyPaymentParams {
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  rawPayload?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  orderId: string;
  transactionId: string;
  amountPaid: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  errorMessage?: string;
}

export interface PaymentWebhookPayload {
  provider: string;
  event: string;
  signature?: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  rawPayload: Record<string, unknown>;
}
