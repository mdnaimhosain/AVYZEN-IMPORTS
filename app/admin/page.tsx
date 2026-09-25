import React from "react";
import Link from "next/link";
import { getAdminAnalytics } from "@/lib/db/store";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowRight, AlertTriangle, Package, ExternalLink } from "lucide-react";

export const revalidate = 0; // Always fresh

export default async function AdminDashboardPage() {
  const analytics = await getAdminAnalytics();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Operations & Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time sales revenue, pending fulfillment pipeline, and inventory status.
          </p>
        </div>
      </div>

      {/* Analytics Stat Cards */}
      <AnalyticsCards data={analytics} />

      {/* Low Stock Warning Alert */}
      {analytics.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <strong className="font-bold">Inventory Alert: </strong>
              <span>
                {analytics.lowStockCount} items have less than 10 units remaining in Banani warehouse.
              </span>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="font-bold underline hover:text-amber-700 whitespace-nowrap"
          >
            Review Stock
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Recent Customer Orders
          </h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 uppercase font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Fulfillment</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {analytics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                analytics.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {o.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{o.customer_name}</div>
                      <div className="text-[11px] text-zinc-400">{o.customer_phone}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(o.total)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={o.payment_status === "PAID" ? "success" : "secondary"}>
                        {o.payment_status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{o.order_status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders?search=${o.order_number}`}
                        className="inline-flex items-center gap-1 font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <span>Manage</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
