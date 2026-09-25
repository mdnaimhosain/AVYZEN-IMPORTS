import React from "react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy — Avyzen Imports",
  description: "Delivery charges, delivery timelines, and courier logistics for Bangladesh.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Shipping & Delivery Policy
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Express nationwide delivery across all 64 districts in Bangladesh
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            1. Delivery Timelines & Charges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Inside Dhaka City
              </span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                ৳{siteConfig.shipping.insideDhaka.rate} • 24 to 48 Hours
              </p>
              <p className="text-xs text-zinc-500">
                Same-day dispatch from Banani fulfillment hub for orders confirmed before 2:00 PM.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Outside Dhaka (All 64 Districts)
              </span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                ৳{siteConfig.shipping.outsideDhaka.rate} • 2 to 4 Days
              </p>
              <p className="text-xs text-zinc-500">
                Dispatched via certified express couriers (Steadfast, Pathao, RedX) with live tracking.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            2. Free Delivery Threshold
          </h2>
          <p>
            All domestic orders with a total order valuation of <strong className="text-zinc-900 dark:text-zinc-100">৳{siteConfig.shipping.freeShippingThreshold.toLocaleString()} or more</strong> qualify for 100% Free Standard Shipping automatically calculated during checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            3. Parcel Inspection
          </h2>
          <p>
            Customers choosing Cash on Delivery are welcome to inspect parcel packaging exterior upon delivery. If any parcel appears crushed or tampered with, please alert the courier and contact our WhatsApp hotline (+8801939846312) immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
