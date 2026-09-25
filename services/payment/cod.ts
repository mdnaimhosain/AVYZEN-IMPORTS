import { CreatePaymentSessionParams, PaymentSessionResult, PaymentVerificationResult } from "@/types/payment";

export class CashOnDeliveryProvider {
  name = "COD";

  async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    return {
      success: true,
      provider: "COD",
      transactionId: `COD-${params.order.order_number}`,
      requiresRedirect: false,
    };
  }

  async verify(orderId: string): Promise<PaymentVerificationResult> {
    // For COD, payment is collected physically upon delivery.
    return {
      isVerified: true,
      orderId,
      transactionId: `COD-${orderId}`,
      amountPaid: 0,
      currency: "BDT",
      status: "UNPAID",
      provider: "COD",
    };
  }
}
