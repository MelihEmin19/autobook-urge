"use client";

import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";

const NAV = [
  { href: "#anasayfa", label: "Ana Sayfa" },
  { href: "#servisler", label: "Servisler" },
  { href: "#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "#rezervasyon", label: "Rezervasyon" },
  { href: "#iletisim", label: "İletişim" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-dark text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#anasayfa" className="flex items-center gap-2 font-bold text-lg">
          <Wrench className="w-6 h-6 text-accent" />
          <span>AutoBook</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium hover:text-accent transition"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#rezervasyon"
            className="bg-accent text-primary-dark font-semibold px-4 py-2 rounded-md hover:brightness-95 transition"
          >
            Rezervasyon Yap
          </a>
        </nav>

        <button
          aria-label="Menü"
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-primary-dark border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a
              href="#rezervasyon"
              className="bg-accent text-primary-dark font-semibold px-4 py-2 rounded-md text-center"
              onClick={() => setOpen(false)}
            >
              Rezervasyon Yap
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
