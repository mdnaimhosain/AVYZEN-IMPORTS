import { NextRequest, NextResponse } from "next/server";
import { orderTrackingSchema } from "@/lib/validations";
import { getOrderByNumberAndPhone } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = orderTrackingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Order Number and Phone Number." },
        { status: 400 }
      );
    }

    const { orderNumber, phone } = validation.data;
    const order = await getOrderByNumberAndPhone(orderNumber, phone);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "No matching order found. Please check your Order ID and phone number.",
        },
        { status: 404 }
      );
    }

    // Sanitize response to prevent exposing unnecessary personal credentials
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        city: order.city,
        area: order.area,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        shipping_fee: order.shipping_fee,
        discount: order.discount,
        total: order.total,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.items?.map((item) => ({
          product_name: item.product_name,
          variant_name: item.variant_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          image_url: item.image_url,
        })),
      },
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to look up order status." },
      { status: 500 }
    );
  }
}
