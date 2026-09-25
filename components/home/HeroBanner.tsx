import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-zinc-950 text-white pt-8 pb-16 lg:py-24 border-b border-zinc-900">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official 2026 Import Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Engineered For Excellence. Curated For You.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
              Discover authentic audiophile sound, high-speed GaN charging solutions, tactile mechanical keyboards, and handcrafted luxury everyday accessories. Delivered nationwide with Cash on Delivery.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" asChild className="font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-100">
                <Link href="/shop" className="gap-2">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="whatsapp"
                className="gap-2 font-bold text-sm"
                asChild
              >
                <a
                  href={generateCustomerSupportUrl("Hello Avyzen Imports, I'm visiting your website and would like to see your latest collection.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order on WhatsApp</span>
                </a>
              </Button>
            </div>

            {/* Micro value badges */}
            <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Same-Day Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white shrink-0">COD</span>
                <span>Pay on Arrival</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-emerald-500/10 group">
              <Image
                src="/images/products/apex-pro.jpg"
                alt="Avyzen Apex Pro Wireless Flagship Headphones"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Featured Flagship
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Avyzen Apex Pro Wireless ANC
                </h3>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <span className="text-xl font-black text-white">৳8,499</span>
                  <Link
                    href="/products/avyzen-apex-pro-wireless-anc-headphones"
                    className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-xl transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
