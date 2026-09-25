import React, { Suspense } from "react";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order — Avyzen Imports",
  description: "Live real-time delivery tracking for your Avyzen Imports parcel.",
};

export default function TrackOrderPage() {
  return (
    <div className="py-12 sm:py-16 bg-zinc-50/60 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Real-Time Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Check the live fulfillment and shipping status of your parcel anytime.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="w-full max-w-3xl h-64 mx-auto rounded-3xl" />}>
          <OrderTracker />
        </Suspense>
      </div>
    </div>
  );
}
