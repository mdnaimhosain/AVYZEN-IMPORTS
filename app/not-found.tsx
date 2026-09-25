import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-white dark:bg-zinc-950">
      <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-6">
        <Search className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-3">
        Page or Product Not Found
      </h1>
      <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8">
        The link you followed may have been updated, removed, or the product might be currently unavailable.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg" className="font-bold">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            <span>Return to Homepage</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-bold">
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Explore Catalog</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
