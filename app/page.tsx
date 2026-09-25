import React from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/db/store";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { WhatsAppCtaBanner } from "@/components/home/WhatsAppCtaBanner";
import { FaqSection } from "@/components/home/FaqSection";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [categories, featuredProducts, bestSellers, newArrivals] = await Promise.all([
    getCategories(),
    getProducts({ featured: true }),
    getProducts({ bestSeller: true }),
    getProducts({ newArrival: true }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Categories Showcase */}
      <CategoryShowcase categories={categories} />

      {/* 3. Featured Products */}
      <section className="py-16 sm:py-20 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Flagship Lineup
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                Featured Gear
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Best Sellers Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Customer Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promotional Mid-Banner */}
      <section className="py-12 bg-zinc-900 text-white border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Special Welcome Promotion
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Get ৳200 OFF Your First Order Above ৳1,500
            </h3>
            <p className="text-xs text-zinc-400">
              Use promo coupon code <strong className="text-white font-mono bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">WELCOME200</strong> during checkout.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 font-bold shrink-0">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* 7. New Arrivals */}
      <section className="py-16 sm:py-20 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Fresh Drops
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
            >
              <span>Explore New Releases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Verified Customer Reviews */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
              Verified Customer Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &quot;Exceptional sound separation and active noise cancellation. Received original package in Dhaka in under 24 hours. Avyzen is genuine!&quot;
              </p>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tanvir Ahmed</p>
                <p className="text-[11px] text-zinc-400">Verified Buyer • Dhaka</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &quot;Gasket mount typing experience on the K75 is creamy and deep. RGB lighting looks premium on dark desk setups. Highly recommended.&quot;
              </p>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Mahmudul Karim</p>
                <p className="text-[11px] text-zinc-400">Software Engineer • Banani</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                &quot;Ordered via WhatsApp and got prompt confirmation from their team. Parcel arrived with proper bubble wrap and unbroken factory seals.&quot;
              </p>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Sajid Hasan</p>
                <p className="text-[11px] text-zinc-400">Verified Buyer • Chittagong</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WhatsApp Banner */}
      <WhatsAppCtaBanner />

      {/* 10. FAQ */}
      <FaqSection />
    </div>
  );
}
