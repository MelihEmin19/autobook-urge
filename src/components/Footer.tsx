import { Wrench } from "lucide-react";

export function Footer({ garageName }: { garageName: string }) {
  return (
    <footer className="bg-primary-dark text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Wrench className="w-5 h-5 text-accent" />
          {garageName}
        </div>
        <div className="text-sm text-white/60">
          &copy; {new Date().getFullYear()} {garageName}. Tüm hakları saklıdır.
        </div>
        <a
          href="/admin/login"
          className="text-sm text-white/60 hover:text-accent transition"
        >
          Yönetim Paneli
        </a>
      </div>
    </footer>
  );
}
