import { NextRequest, NextResponse } from "next/server";
import { couponValidationSchema } from "@/lib/validations";
import { validateCoupon } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = couponValidationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon parameters" },
        { status: 400 }
      );
    }

    const { code, subtotal } = validation.data;
    const result = await validateCoupon(code, subtotal);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      code: result.coupon?.code,
      discount: result.discount,
      message: result.message,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
