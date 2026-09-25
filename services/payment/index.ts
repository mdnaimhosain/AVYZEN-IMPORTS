import { CashOnDeliveryProvider } from "./cod";
import { OnlineGatewayProvider } from "./online";
import {
  CreatePaymentSessionParams,
  PaymentSessionResult,
  PaymentVerificationResult,
  PaymentWebhookPayload,
} from "@/types/payment";
import { getOrderById, updateOrderStatus, recordPayment } from "@/lib/db/store";
import { sendOrderWhatsAppNotification } from "@/services/whatsapp";

export class PaymentService {
  private codProvider: CashOnDeliveryProvider;
  private onlineProvider: OnlineGatewayProvider;
  // Idempotency memory cache to block replayed webhook attacks
  private processedTransactions: Set<string>;

  constructor() {
    this.codProvider = new CashOnDeliveryProvider();
    this.onlineProvider = new OnlineGatewayProvider();
    this.processedTransactions = new Set<string>();
  }

  async createPayment(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    if (params.order.payment_method === "COD") {
      return this.codProvider.createSession(params);
    } else {
      return this.onlineProvider.createSession(params);
    }
  }

  async verifyPayment(params: {
    orderId: string;
    transactionId: string;
    amount: number;
    currency: string;
    rawPayload?: Record<string, unknown>;
  }): Promise<PaymentVerificationResult> {
    const order = await getOrderById(params.orderId);
    if (!order) {
      return {
        isVerified: false,
        orderId: params.orderId,
        transactionId: params.transactionId,
        amountPaid: 0,
        currency: params.currency,
        status: "FAILED",
        provider: "UNKNOWN",
        errorMessage: "Order not found in database.",
      };
    }

    // CRITICAL SECURITY: Never trust client amount! Verify against database order total.
    if (Math.abs(order.total - params.amount) > 0.01) {
      return {
        isVerified: false,
        orderId: params.orderId,
        transactionId: params.transactionId,
        amountPaid: params.amount,
        currency: params.currency,
        status: "FAILED",
        provider: this.onlineProvider.name,
        errorMessage: `Payment amount mismatch: Expected ৳${order.total}, received ৳${params.amount}.`,
      };
    }

    const verification = await this.onlineProvider.verify(params);
    return verification;
  }

  async handleWebhook(payload: PaymentWebhookPayload): Promise<{
    success: boolean;
    idempotentRepeat?: boolean;
    error?: string;
  }> {
    // 1. Idempotency Check: Prevent duplicate webhook processing
    const idempotencyKey = `${payload.provider}:${payload.transactionId}:${payload.orderId}`;
    if (this.processedTransactions.has(idempotencyKey)) {
      return {
        success: true,
        idempotentRepeat: true,
      };
    }

    // 2. Fetch order from DB
    const order = await getOrderById(payload.orderId);
    if (!order) {
      return { success: false, error: "Order referenced in webhook does not exist." };
    }

    // 3. Prevent duplicate order processing if already paid
    if (order.payment_status === "PAID") {
      this.processedTransactions.add(idempotencyKey);
      return { success: true, idempotentRepeat: true };
    }

    // 4. Verify amount & currency
    if (Math.abs(order.total - payload.amount) > 0.01) {
      await recordPayment({
        orderId: order.id,
        provider: payload.provider,
        transactionId: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: "FAILED",
        rawReferenceId: "AMOUNT_MISMATCH",
      });
      return { success: false, error: "Amount tampering detected in webhook payload." };
    }

    // 5. Update Payment and Order status in database
    if (payload.status === "PAID") {
      await recordPayment({
        orderId: order.id,
        provider: payload.provider,
        transactionId: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: "PAID",
      });

      await updateOrderStatus(order.id, "PAID", "PAID");

      // Mark transaction as processed
      this.processedTransactions.add(idempotencyKey);

      // 6. Trigger automated WhatsApp notification
      try {
        const updatedOrder = await getOrderById(order.id);
        if (updatedOrder) {
          await sendOrderWhatsAppNotification(updatedOrder);
        }
      } catch (err) {
        console.error("WhatsApp notification dispatch error (order remains safe):", err);
      }

      return { success: true };
    } else {
      await recordPayment({
        orderId: order.id,
        provider: payload.provider,
        transactionId: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: "FAILED",
      });

      await updateOrderStatus(order.id, "PAYMENT_PENDING", "FAILED");
      return { success: false, error: "Payment was not completed." };
    }
  }
}

export const paymentService = new PaymentService();
