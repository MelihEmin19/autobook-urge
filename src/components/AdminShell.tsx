"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: CalendarDays },
  { href: "/admin/servisler", label: "Servisler", icon: Wrench },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-primary-dark text-white h-14 flex items-center justify-between px-4 shadow">
        <button onClick={() => setOpen(!open)} aria-label="Menü">
          {open ? <X /> : <Menu />}
        </button>
        <span className="font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" /> AutoBook Admin
        </span>
        <button onClick={logout} aria-label="Çıkış">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static lg:translate-x-0 z-30 w-64 bg-primary-dark text-white min-h-screen flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 h-16 flex items-center gap-2 font-bold border-b border-white/10">
          <Wrench className="w-6 h-6 text-accent" />
          AutoBook Admin
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-accent text-primary-dark"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/60 mb-2">Oturum</p>
          <p className="text-sm font-medium mb-3 truncate">{userName}</p>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-sm py-2 rounded-md"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
