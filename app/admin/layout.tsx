import React from "react";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth/admin";

export const metadata = {
  title: "Admin Operations Portal — Avyzen Imports",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifyAdminSessionToken(token);

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-900/10 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
