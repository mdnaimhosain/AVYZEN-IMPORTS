import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus } from "@/lib/db/store";
import { OrderStatus, PaymentStatus } from "@/types/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";

    const orders = await getAllOrders({ status, search });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json({ success: false, error: "Order ID and status are required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(
      orderId,
      orderStatus as OrderStatus,
      paymentStatus as PaymentStatus | undefined
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
  }
}
