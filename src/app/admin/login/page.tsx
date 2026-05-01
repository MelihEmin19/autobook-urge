"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Giriş başarısız");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Sunucu hatası");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-sm border border-border p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <Wrench className="w-7 h-7 text-accent" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Yönetim Paneli</h1>
        <p className="text-muted text-center text-sm mb-6">
          AutoBook Admin Girişi
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-danger/10 border border-danger text-danger p-3 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">E-posta</label>
            <input
              name="email"
              type="email"
              required
              className="w-full h-11 px-3 rounded-md border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parola</label>
            <input
              name="password"
              type="password"
              required
              className="w-full h-11 px-3 rounded-md border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          <a href="/" className="hover:text-primary">
            ← Ana sayfaya dön
          </a>
        </p>
      </div>
    </div>
  );
}
