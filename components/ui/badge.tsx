import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
    secondary: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
    destructive: "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400",
    outline: "border border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
