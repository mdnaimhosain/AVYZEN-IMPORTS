"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/cart-context";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "../cart/CartDrawer";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Truck className="w-3.5 h-3.5" />
              Express Delivery Nationwide
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-400">
              100% Authentic Curated Tech & Luxury Gear
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/track-order"
              className="hover:text-white transition-colors text-zinc-400 hover:underline"
            >
              Track Order
            </Link>
            <a
              href={generateCustomerSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: {siteConfig.business.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 -ml-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                  AVYZEN
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400 dark:text-zinc-500">
                  Imports
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Shop All
              </Link>

              {/* Categories Popover Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors py-2">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {categoryDropdown && (
                  <div className="absolute top-full left-0 w-64 p-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link
                      href="/shop?category=audio"
                      className="block px-3 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    >
                      Audio & Sound
                    </Link>
                    <Link
                      href="/shop?category=electronics"
                      className="block px-3 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    >
                      Electronics & Chargers
                    </Link>
                    <Link
                      href="/shop?category=smart-gadgets"
                      className="block px-3 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    >
                      Smart Gadgets & Setups
                    </Link>
                    <Link
                      href="/shop?category=lifestyle"
                      className="block px-3 py-2.5 rounded-xl text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    >
                      Lifestyle & Luxury EDC
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Inline Desktop Search or Search Toggle */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
              </form>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl md:hidden"
              aria-label="Toggle search input"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              aria-label={`Open shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                  {itemCount}
                </span>
              )}
            </button>

            {/* WhatsApp CTA Button */}
            <a
              href={generateCustomerSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-xs shadow-md shadow-emerald-500/20 hover:bg-[#20ba5a] active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Admin icon link */}
            <Link
              href="/admin"
              className="p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors hidden xl:flex"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile search expandable row */}
        {searchOpen && (
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 md:hidden animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search catalog by name, model, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-zinc-900 text-sm border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </form>
          </div>
        )}
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Global Slide-in Cart Drawer */}
      <CartDrawer />
    </>
  );
}
