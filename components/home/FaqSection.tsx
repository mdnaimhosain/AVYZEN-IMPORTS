"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are the products 100% authentic and original?",
      a: "Yes, absolutely. Every item featured on Avyzen Imports is sourced directly from certified international distributors or brand manufacturers. We do not deal in replicas, counterfeits, or unauthorized copies. Every product comes in original factory sealed packaging.",
    },
    {
      q: "How does Cash on Delivery (COD) work?",
      a: "With Cash on Delivery, you place your order online without needing to enter credit card or bank details. When the courier delivery officer arrives at your address, you can inspect the package exterior, verify the delivery details, and pay the exact total in cash.",
    },
    {
      q: "What are your delivery times and shipping charges across Bangladesh?",
      a: "Delivery inside Dhaka is ৳70 and arrives within 24 to 48 hours. Delivery outside Dhaka across all 64 districts is ৳130 and takes 2 to 4 business days. Orders with a total value of ৳5,000 or above qualify for 100% Free Standard Shipping.",
    },
    {
      q: "Can I place my order directly through WhatsApp?",
      a: "Yes! Simply click the WhatsApp button anywhere on our site, or message us directly at +8801939846312. You can send us the product name or link along with your delivery address, and our support representative will confirm your order immediately.",
    },
    {
      q: "What is your warranty and return policy?",
      a: "We offer a 7-day replacement warranty on all electronic and gadget items for manufacturing defects. If your product is defective upon arrival, inform us within 7 days with your order reference number, and we will arrange an exchange.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            Everything You Need To Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-zinc-900 dark:text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
