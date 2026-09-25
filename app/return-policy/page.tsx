import React from "react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return and Refund Policy — Avyzen Imports",
  description: "7-day replacement warranty and return policy guidelines.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Return & Refund Policy
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            7-Day Replacement Guarantee • {siteConfig.name}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            1. 7-Day Replacement Warranty
          </h2>
          <p>
            We stand behind every authentic product we import. All electronics, audio gadgets, chargers, and mechanical hardware include a 7-day replacement warranty covering manufacturer defects or operational failures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            2. Return Eligibility Criteria
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The product must be reported within 7 calendar days from the delivery date.</li>
            <li>The item must be in its original factory packaging with all included cables, accessories, and user manuals.</li>
            <li>Physical damage, water damage, or electrical burns caused by improper voltage will not qualify.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            3. How to Initiate a Return
          </h2>
          <p>
            Simply reach out to our WhatsApp support concierge at <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{siteConfig.business.whatsappDisplay}</strong> with your Order Number (ORD-2026-XXXXXX) and a short video or photo demonstrating the issue. Our Banani support team will arrange replacement courier pick-up.
          </p>
        </section>
      </div>
    </div>
  );
}
