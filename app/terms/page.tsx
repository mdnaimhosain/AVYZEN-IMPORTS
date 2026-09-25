import React from "react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions — Avyzen Imports",
  description: "Terms of service and purchasing conditions for Avyzen Imports.",
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Terms & Conditions
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Last updated: March 2026 • {siteConfig.business.legalName}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            1. Scope of Agreement
          </h2>
          <p>
            By visiting, browsing, or placing orders on {siteConfig.name} or via our WhatsApp concierge (+8801939846312), you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            2. Orders and Verification
          </h2>
          <p>
            Orders placed on the site constitute an offer to purchase. We reserve the right to verify order details via telephone or WhatsApp prior to courier dispatch. In cases where suspected fraudulent activity or unreachable phone numbers occur, we may cancel the order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            3. Pricing and Availability
          </h2>
          <p>
            All listed prices are denominated in Bangladeshi Taka (৳ BDT). Product availability is synchronized in real-time. In the unlikely event of an inventory discrepancy, you will be notified immediately with an option for an alternative or instant refund.
          </p>
        </section>
      </div>
    </div>
  );
}
