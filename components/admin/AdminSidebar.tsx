"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Store,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { title: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Products Management", href: "/admin/products", icon: Package },
    { title: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { title: "Categories", href: "/admin/categories", icon: FolderTree },
    { title: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-300 border-r border-zinc-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-sm">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block">
              {siteConfig.shortName} Admin
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
              Operations Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 text-xs font-semibold">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-zinc-800 text-white font-bold shadow-xs border border-zinc-700/60"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Storefront shortcut */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Role: Administrator</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>View Live Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
