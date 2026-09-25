"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search, MessageCircle, ExternalLink, ShieldCheck, Package } from "lucide-react";
import { siteConfig } from "@/config/site";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (!open) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
              {siteConfig.name}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          </form>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
          >
            Shop All Catalog
          </Link>

          <div className="pt-2 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Categories
          </div>
          <Link
            href="/shop?category=audio"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Audio & Sound
          </Link>
          <Link
            href="/shop?category=electronics"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Electronics & Chargers
          </Link>
          <Link
            href="/shop?category=smart-gadgets"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Smart Gadgets & Setups
          </Link>
          <Link
            href="/shop?category=lifestyle"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Lifestyle & Luxury EDC
          </Link>

          <div className="pt-3 pb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Customer Care
          </div>
          <Link
            href="/track-order"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Package className="w-4 h-4 text-emerald-500" />
            Track Order
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            About Avyzen
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Contact & Support
          </Link>
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            Admin Portal
          </Link>
        </div>

        {/* WhatsApp Footer CTA */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <a
            href={generateCustomerSupportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <p className="text-center text-[11px] text-zinc-400 mt-2 font-mono">
            {siteConfig.business.whatsappDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
