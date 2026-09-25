"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types/database";
import { Filter, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/shop");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        {(currentCategory || inStockOnly || minPrice || maxPrice || currentSort !== "featured") && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Categories
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateParam("category", null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !currentCategory
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                currentCategory === cat.slug
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="featured">Featured Picks</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="w-4 h-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
