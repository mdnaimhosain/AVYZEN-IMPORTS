import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/services/payment";
import { paymentWebhookSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const rawBodyText = await req.text();
    let body: Record<string, unknown>;

    try {
      body = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // 1. Zod Validation
    const validation = paymentWebhookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Webhook payload schema mismatch", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { provider, orderId, transactionId, amount, currency, status, signature } = validation.data;

    // 2. Delegate to PaymentService with idempotency and signature checks
    const result = await paymentService.handleWebhook({
      provider,
      orderId,
      transactionId,
      amount,
      currency,
      status,
      signature,
      event: "payment.completed",
      rawPayload: body,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Webhook processing failed" }, { status: 422 });
    }

    return NextResponse.json({
      received: true,
      idempotentRepeat: result.idempotentRepeat || false,
    });
  } catch (error) {
    console.error("Unhandled error inside payment webhook:", error);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}
