import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutShell adminEmail={session.user.email}>
      {children}
    </AdminLayoutShell>
  );
}
