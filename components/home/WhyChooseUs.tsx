import React from "react";
import { ShieldCheck, Truck, Headphones, RotateCcw, Award, CheckCircle } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Genuine Imports",
      description: "Directly imported from original manufacturers & authorized regional distributors with serial verification.",
    },
    {
      icon: Truck,
      title: "Nationwide Fast Delivery",
      description: "24 to 48 hours delivery within Dhaka metropolitan, and 2 to 4 days across all 64 districts in Bangladesh.",
    },
    {
      icon: Award,
      title: "Cash on Delivery",
      description: "Inspect your package before payment. No compulsory upfront deposit required for standard stock items.",
    },
    {
      icon: Headphones,
      title: "Direct WhatsApp Support",
      description: "One-on-one personal customer assistance on WhatsApp (+8801939846312) for orders, setup, and questions.",
    },
    {
      icon: RotateCcw,
      title: "Replacement Warranty",
      description: "7-day replacement warranty for manufacturing defects, backed by responsive local support in Dhaka.",
    },
    {
      icon: CheckCircle,
      title: "Rigorous Quality Check",
      description: "Every item is physically inspected for build integrity and packaging seal before dispatch.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900/60 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Why Avyzen Imports
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            Built on Authenticity, Speed & Reliability
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            We eliminate counterfeit products and unpredictable overseas delays by maintaining inspected stock right here in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
