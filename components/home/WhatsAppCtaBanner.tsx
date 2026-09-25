"use client";

import React from "react";
import { MessageCircle, PhoneCall, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { generateCustomerSupportUrl } from "@/services/whatsapp";
import { Button } from "@/components/ui/button";

export function WhatsAppCtaBanner() {
  const whatsappUrl = generateCustomerSupportUrl("Hello Avyzen Imports! I am interested in placing an order or inquiring about product availability.");

  return (
    <section className="py-14 bg-zinc-950 text-white overflow-hidden relative border-t border-zinc-800">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#25D366] flex items-center justify-center lg:justify-start gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              Direct Personal Ordering
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Prefer to Order or Chat on WhatsApp?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Send us the product photo, name, or link on WhatsApp at <strong className="text-white font-mono">{siteConfig.business.whatsappDisplay}</strong>. Our customer concierge will assist with instant order placement and dispatch confirmation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Button
              size="lg"
              variant="whatsapp"
              className="w-full sm:w-auto gap-2 font-bold text-sm shadow-xl shadow-emerald-500/20"
              onClick={() => window.open(whatsappUrl, "_blank")}
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Open WhatsApp Chat</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
