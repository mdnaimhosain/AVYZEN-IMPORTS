import React from "react";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db/store";
import { OrderSuccessCard } from "@/components/order/OrderSuccessCard";
import { OrderConfirmationClientFallback } from "@/components/order/OrderConfirmationClientFallback";
import type { Metadata } from "next";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = {
  title: "Order Confirmed — Avyzen Imports",
  description: "Your order details, invoice receipt, and delivery tracking information.",
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  return (
    <div className="py-12 sm:py-16 bg-zinc-50/60 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {order ? (
          <OrderSuccessCard order={order} />
        ) : (
          <OrderConfirmationClientFallback orderId={orderId} />
        )}
      </div>
    </div>
  );
}
