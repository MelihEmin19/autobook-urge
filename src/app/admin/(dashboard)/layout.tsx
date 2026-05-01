import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.userId) {
    redirect("/admin/login");
  }

  return (
    <AdminShell userName={session.name ?? session.email ?? "Admin"}>
      {children}
    </AdminShell>
  );
}
