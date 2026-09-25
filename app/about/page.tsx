import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Award, MessageCircle, MapPin } from "lucide-react";
import { generateCustomerSupportUrl } from "@/services/whatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Avyzen Imports",
  description: "Learn about Avyzen Imports, our curated tech gear, Banani hub, and commitment to authentic imports.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            About Our Brand
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50">
            Crafted for Purists & Discerning Creators
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-6">
          <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Authentic Tech, Zero Compromises
            </h2>
            <p>
              Founded with the objective to bring certified, original high-performance technology and lifestyle gear to Bangladesh, {siteConfig.name} curates premier audiophile headphones, GaN charging architecture, custom mechanical keyboards, and precision accessories.
            </p>
            <p>
              Too many tech enthusiasts in Bangladesh face the frustration of knock-offs, overpriced retail markups, or weeks of uncertain overseas shipping. We maintain direct relationships with authorized supply lines and keep inspected inventory right here in Dhaka.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-xs">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Headquarters & Fulfillment: {siteConfig.business.address}</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
            <img
              src="/images/categories/smart-gadgets.jpg"
              alt="Avyzen Workspace Setup"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">100% Genuine Guarantee</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every unit comes with factory serial numbers and original international manufacturer warranty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <Truck className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Express Nationwide Dispatch</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Dispatched directly from Dhaka with 24-48h delivery in Dhaka and 2-4 days across Bangladesh.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <Award className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">7-Day Local Warranty</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Prompt replacement support for factory defects handled directly through our Banani customer care.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/shop">Browse Catalog</Link>
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              className="gap-2 font-bold"
              asChild
            >
              <a
                href={generateCustomerSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact on WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
