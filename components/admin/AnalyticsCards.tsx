import React from "react";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Clock, CheckCircle2, AlertTriangle, Package } from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockCount: number;
}

export function AnalyticsCards({ data }: { data: AnalyticsData }) {
  const cards = [
    {
      title: "Gross Paid Revenue",
      value: formatPrice(data.totalRevenue),
      desc: "Total verified payments",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toString(),
      desc: `${data.paidOrders} marked as paid`,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending Fulfillment",
      value: data.pendingOrders.toString(),
      desc: "Requires dispatch action",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Total Catalog Items",
      value: data.totalProducts.toString(),
      desc: `${data.lowStockCount} items low stock`,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {c.value}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">{c.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
