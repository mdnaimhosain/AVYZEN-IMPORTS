import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Operations Portal — Avyzen Imports",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-900/10 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
