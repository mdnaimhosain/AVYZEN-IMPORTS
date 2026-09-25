import React from "react";
import { Product } from "@/types/database";
import { ProductCard } from "./ProductCard";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = "No products found matching your criteria." }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Catalog Item Not Found
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mb-6">
          {emptyMessage}
        </p>
        <Button variant="outline" asChild>
          <Link href="/shop">Clear Filters & View All</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
