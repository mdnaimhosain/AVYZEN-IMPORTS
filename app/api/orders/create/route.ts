import { NextRequest, NextResponse } from "next/server";
import { createOrderServerSchema } from "@/lib/validations";
import { createOrderSecure } from "@/lib/db/store";
import { paymentService } from "@/services/payment";
import { dispatchAllOrderNotifications } from "@/services/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Server-side Validation
    const validation = createOrderServerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 2. Server-side Secure Order Creation (Never trusts client prices or stock)
    const result = await createOrderSecure({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || "order@avyzenimports.com",
      address: data.address,
      city: data.city,
      area: data.area,
      postalCode: data.postalCode,
      deliveryNotes: data.deliveryNotes,
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode,
      items: data.items,
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to process order" },
        { status: 422 }
      );
    }

    const order = result.order;

    // 3. Payment Processing
    if (order.payment_method === "ONLINE") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const paymentSession = await paymentService.createPayment({
        order,
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          address: order.address,
          city: order.city,
          postalCode: order.postal_code,
        },
        redirectUrls: {
          successUrl: `${siteUrl}/order-confirmation/${order.id}?status=paid`,
          failUrl: `${siteUrl}/checkout?error=payment_failed&orderId=${order.id}`,
          cancelUrl: `${siteUrl}/checkout?error=payment_cancelled&orderId=${order.id}`,
        },
      });

      return NextResponse.json({
        success: true,
        order,
        paymentSession,
      });
    }

    // For COD: Order is immediately confirmed with UNPAID status
    // Dispatch asynchronous multi-channel notifications (Telegram, WhatsApp, Email)
    dispatchAllOrderNotifications(order).catch((err) => {
      console.error("Background notification error:", err);
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Fatal error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while processing order." },
      { status: 500 }
    );
  }
}
