import React from "react";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone, ShieldCheck, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800">
      {/* Top Value Badges Section */}
      <div className="border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">100% Authentic Imports</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct sourced from certified global distributors with genuine product guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Fast Delivery</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  24–48h express delivery within Dhaka; 2–4 days nationwide across all 64 districts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">WhatsApp Ordering</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inquire and order directly through our official WhatsApp hotline at your convenience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 shrink-0">
                <span className="font-bold text-sm">COD</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Cash on Delivery</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inspect your parcel upon arrival and pay cash or online through secure gateways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-base">
                A
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            <div className="pt-2 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{siteConfig.business.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href={`mailto:${siteConfig.business.email}`} className="hover:text-white transition-colors">
                  {siteConfig.business.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href={`tel:${siteConfig.business.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.business.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=audio" className="hover:text-white transition-colors">
                  Audio & Sound
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electronics" className="hover:text-white transition-colors">
                  Electronics & Chargers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=smart-gadgets" className="hover:text-white transition-colors">
                  Smart Workspace Gadgets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lifestyle" className="hover:text-white transition-colors">
                  Lifestyle & Luxury Watches
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {siteConfig.footerLinks.customerCare.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Direct WhatsApp Callout */}
            <div className="mt-6 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] text-zinc-400 mb-2">Have a question or custom request?</p>
              <a
                href={generateCustomerSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Methods */}
      <div className="border-t border-zinc-900 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.business.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Accepted Payments:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300">
                bKash
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300">
                Nagad
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300">
                Visa / MC
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300">
                COD
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
