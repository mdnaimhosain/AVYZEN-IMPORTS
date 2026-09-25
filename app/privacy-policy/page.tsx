import React from "react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Avyzen Imports",
  description: "Privacy and data protection policy for Avyzen Imports customers.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Last updated: March 2026 • Effective for {siteConfig.name}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            1. Information We Collect
          </h2>
          <p>
            When you purchase products, inquire via WhatsApp, or create an order on {siteConfig.name}, we collect only necessary fulfillment information: your full name, mobile telephone number, email address, and physical delivery address within Bangladesh.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            2. How We Use Your Data
          </h2>
          <p>
            Your information is strictly utilized to process your transactions, generate verified courier delivery waybills (e.g. Steadfast, Pathao, RedX, eCourier), provide automated order confirmations, and furnish customer care via WhatsApp ({siteConfig.business.whatsappDisplay}).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            3. Payment Security & Data Isolation
          </h2>
          <p>
            We do not store complete debit/credit card numbers or mobile financial service PINs on our servers. All digital transactions are securely routed through regulated payment gateway providers utilizing SSL 256-bit encryption.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            4. Third-Party Sharing
          </h2>
          <p>
            We never sell, rent, or trade your personal information. Data is disclosed only to designated courier logistic partners solely for parcel drop-off execution.
          </p>
        </section>
      </div>
    </div>
  );
}
