"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types/database";
import { OrderSuccessCard } from "@/components/order/OrderSuccessCard";
import { Loader2, Search, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationClientFallbackProps {
  orderId: string;
}

export function OrderConfirmationClientFallback({ orderId }: OrderConfirmationClientFallbackProps) {
  const [cachedOrder, setCachedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item =
          sessionStorage.getItem(`avyzen_order_${orderId}`) ||
          sessionStorage.getItem("avyzen_latest_order");

        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && (parsed.id === orderId || !orderId || orderId === "latest")) {
            setCachedOrder(parsed);
          } else if (parsed) {
            setCachedOrder(parsed);
          }
        }
      }
    } catch (e) {
      console.error("Session storage lookup failed:", e);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="text-xs text-zinc-500 font-medium">Looking up your order receipt...</p>
      </div>
    );
  }

  if (cachedOrder) {
    return <OrderSuccessCard order={cachedOrder} />;
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
        <Package className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Order Confirmed & Processing
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Your order has been recorded in our dispatch warehouse. You can verify status or contact our customer support team directly.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="sm" asChild>
          <Link href="/track-order" className="gap-2">
            <Search className="w-4 h-4" />
            <span>Track by Phone Number</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/shop" className="gap-2">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
