import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/types/database";

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 transition-colors"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-72 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600"}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-1 mt-1 font-light">
                      {cat.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
