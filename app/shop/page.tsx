import React from "react";
import { getCategories, getProducts, ProductFilters as FilterType } from "@/lib/db/store";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Package } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const metadata = {
  title: "Shop All Curated Imports — Avyzen",
  description: "Browse authentic imported electronics, audiophile sound gear, mechanical keyboards, and lifestyle accessories.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: FilterType = {
    categorySlug: params.category,
    search: params.search,
    sort: params.sort,
    inStock: params.inStock === "true",
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  };

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(filters),
  ]);

  const activeCategoryObj = categories.find((c) => c.slug === params.category);

  return (
    <div className="py-10 bg-zinc-50/50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Package className="w-4 h-4" />
            <span>Curated Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
            {activeCategoryObj ? activeCategoryObj.name : "All Products"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {activeCategoryObj?.description ||
              `Showing ${products.length} authentic imported items with nationwide fast delivery.`}
          </p>
          {params.search && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
              Search results for: <span className="font-bold text-zinc-900 dark:text-zinc-100">&quot;{params.search}&quot;</span>
            </p>
          )}
        </div>

        {/* Catalog layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar filters */}
          <div className="lg:col-span-1 sticky top-24">
            <ProductFilters categories={categories} />
          </div>

          {/* Main Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              emptyMessage={
                params.search
                  ? `No products found matching "${params.search}". Try checking for spelling errors or searching for a different keyword.`
                  : "No products currently available matching these filter options."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
