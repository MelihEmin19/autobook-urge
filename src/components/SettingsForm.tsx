"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";

type Setting = {
  garageName: string;
  phone: string;
  address: string;
  slotMinutes: number;
};

type Hour = {
  dayOfWeek: number;
  name: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

type ClosedDay = { id: number; date: string; reason: string | null };

export function SettingsForm({
  initialSetting,
  initialHours,
  initialClosed,
}: {
  initialSetting: Setting;
  initialHours: Hour[];
  initialClosed: ClosedDay[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const [setting, setSetting] = useState(initialSetting);
  const [hours, setHours] = useState(initialHours);
  const [newClosed, setNewClosed] = useState({ date: "", reason: "" });

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2500);
  }

  function saveGeneral(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      });
      flash("Genel ayarlar kaydedildi");
      router.refresh();
    });
  }

  function saveHours(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await fetch("/api/admin/settings/hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });
      flash("Çalışma saatleri kaydedildi");
      router.refresh();
    });
  }

  function addClosed(e: React.FormEvent) {
    e.preventDefault();
    if (!newClosed.date) return;
    startTransition(async () => {
      await fetch("/api/admin/settings/closed-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClosed),
      });
      setNewClosed({ date: "", reason: "" });
      router.refresh();
    });
  }

  function removeClosed(id: number) {
    startTransition(async () => {
      await fetch(`/api/admin/settings/closed-days/${id}`, {
        method: "DELETE",
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 relative">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-success text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          {saved}
        </div>
      )}

      {/* Genel */}
      <Section title="Garaj Bilgileri">
        <form onSubmit={saveGeneral} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Garaj Adı"
              value={setting.garageName}
              onChange={(v) => setSetting({ ...setting, garageName: v })}
            />
            <Input
              label="Telefon"
              value={setting.phone}
              onChange={(v) => setSetting({ ...setting, phone: v })}
            />
          </div>
          <Input
            label="Adres"
            value={setting.address}
            onChange={(v) => setSetting({ ...setting, address: v })}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Slot Süresi (dakika)"
              type="number"
              value={String(setting.slotMinutes)}
              onChange={(v) =>
                setSetting({ ...setting, slotMinutes: Number(v) || 30 })
              }
            />
          </div>
          <SubmitBtn pending={pending}>Genel Ayarları Kaydet</SubmitBtn>
        </form>
      </Section>

      {/* Saatler */}
      <Section title="Çalışma Saatleri">
        <form onSubmit={saveHours} className="space-y-3">
          {hours.map((h, idx) => (
            <div
              key={h.dayOfWeek}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center"
            >
              <span className="font-medium">{h.name}</span>
              <input
                type="time"
                value={h.openTime}
                disabled={h.isClosed}
                onChange={(e) => {
                  const next = [...hours];
                  next[idx] = { ...h, openTime: e.target.value };
                  setHours(next);
                }}
                className="h-10 px-3 rounded-md border border-border disabled:bg-background disabled:opacity-50"
              />
              <input
                type="time"
                value={h.closeTime}
                disabled={h.isClosed}
                onChange={(e) => {
                  const next = [...hours];
                  next[idx] = { ...h, closeTime: e.target.value };
                  setHours(next);
                }}
                className="h-10 px-3 rounded-md border border-border disabled:bg-background disabled:opacity-50"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={h.isClosed}
                  onChange={(e) => {
                    const next = [...hours];
                    next[idx] = { ...h, isClosed: e.target.checked };
                    setHours(next);
                  }}
                />
                Kapalı
              </label>
            </div>
          ))}
          <SubmitBtn pending={pending}>Saatleri Kaydet</SubmitBtn>
        </form>
      </Section>

      {/* Kapalı günler */}
      <Section title="Kapalı Günler (Tatil/Bayram)">
        <form
          onSubmit={addClosed}
          className="grid sm:grid-cols-3 gap-3 mb-4 items-end"
        >
          <Input
            label="Tarih"
            type="date"
            value={newClosed.date}
            onChange={(v) => setNewClosed({ ...newClosed, date: v })}
          />
          <Input
            label="Sebep (opsiyonel)"
            value={newClosed.reason}
            onChange={(v) => setNewClosed({ ...newClosed, reason: v })}
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 bg-primary text-white px-4 rounded-md font-medium hover:bg-primary-dark flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> Ekle
          </button>
        </form>

        {initialClosed.length === 0 ? (
          <p className="text-muted text-sm">
            Henüz kapalı gün eklenmemiş.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-md overflow-hidden">
            {initialClosed.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-background/50"
              >
                <span>
                  <strong>{c.date}</strong>
                  {c.reason ? ` - ${c.reason}` : ""}
                </span>
                <button
                  onClick={() => removeClosed(c.id)}
                  className="p-1.5 text-danger hover:bg-danger/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-md border border-border"
      />
    </div>
  );
}

function SubmitBtn({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-white px-5 py-2 rounded-md font-medium hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
