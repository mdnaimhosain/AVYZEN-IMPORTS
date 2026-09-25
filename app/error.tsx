"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely to monitoring provider (e.g. Sentry)
    console.error("Global boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-white dark:bg-zinc-950">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-500 mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
        System Notice
      </span>
      <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-3">
        Something Unexpected Occurred
      </h1>
      <p className="text-sm text-zinc-500 max-w-md mx-auto mb-8">
        We encountered a temporary issue while loading this page. Our technical team has been notified.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} size="lg" className="font-bold">
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Try Again</span>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-bold">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            <span>Go to Homepage</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
