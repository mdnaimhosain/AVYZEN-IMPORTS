"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Friendly Tooltip Bubble */}
      {showTooltip && (
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom duration-300">
          <span>Need help or order on WhatsApp?</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={generateCustomerSupportUrl("Hello Avyzen Imports, I would like to inquire about placing an order.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Avyzen on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 hover:bg-[#20ba5a]"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
}
