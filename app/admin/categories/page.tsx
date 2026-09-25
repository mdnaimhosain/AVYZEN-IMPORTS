import React from "react";
import Image from "next/image";
import { getCategories } from "@/lib/db/store";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Catalog taxonomies and category landing pages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={c.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400"}
                alt={c.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{c.name}</h3>
                <Badge variant={c.is_active ? "success" : "secondary"}>Active</Badge>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-2">/{c.slug}</p>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {c.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
