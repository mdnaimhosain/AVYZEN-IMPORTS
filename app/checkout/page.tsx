import React from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShieldCheck, Truck, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout — Avyzen Imports",
  description: "Complete your order with Cash on Delivery or instant online payment.",
};

export default function CheckoutPage() {
  return (
    <div className="py-10 bg-zinc-50/50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Guest checkout supported. Enter your delivery address to receive your parcel.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              256-Bit Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Truck className="w-3.5 h-3.5" />
              Nationwide Delivery
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authentic Guarantee
            </span>
          </div>
        </div>

        {/* Main Interactive Checkout Form */}
        <CheckoutForm />
      </div>
    </div>
  );
}
