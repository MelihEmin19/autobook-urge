"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { formatGBP } from "@/lib/utils";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  isActive: boolean;
};

export function ServicesAdmin({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  async function save(s: Partial<Service>) {
    const isNew = !s.id;
    startTransition(async () => {
      await fetch(isNew ? "/api/admin/services" : `/api/admin/services/${s.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      setEditing(null);
      setCreating(false);
      router.refresh();
    });
  }

  async function remove(id: number) {
    if (!confirm("Bu servis silinsin mi?")) return;
    startTransition(async () => {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark"
        >
          <Plus className="w-4 h-4" /> Yeni Servis
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background text-muted">
            <tr>
              <Th>Ad</Th>
              <Th>Açıklama</Th>
              <Th>Fiyat</Th>
              <Th>Süre</Th>
              <Th>Aktif</Th>
              <Th>İşlem</Th>
            </tr>
          </thead>
          <tbody>
            {initialServices.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <Td className="font-medium">{s.name}</Td>
                <Td className="max-w-xs truncate text-muted">{s.description}</Td>
                <Td>{formatGBP(s.price)}</Td>
                <Td>{s.durationMin} dk</Td>
                <Td>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      s.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted/20 text-muted"
                    }`}
                  >
                    {s.isActive ? "Aktif" : "Pasif"}
                  </span>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(s)}
                      className="p-1.5 hover:bg-background rounded"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="p-1.5 hover:bg-danger/10 text-danger rounded"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ServiceModal
          service={editing}
          pending={pending}
          onSave={save}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </>
  );
}

function ServiceModal({
  service,
  pending,
  onSave,
  onClose,
}: {
  service: Service | null;
  pending: boolean;
  onSave: (s: Partial<Service>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Service>>(
    service ?? { name: "", description: "", price: 0, durationMin: 60, isActive: true }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl border border-border w-full max-w-lg">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold">
            {service ? "Servisi Düzenle" : "Yeni Servis"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-background rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Ad</label>
            <input
              required
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              required
              rows={3}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md border border-border resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fiyat (£)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price ?? 0}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full h-10 px-3 rounded-md border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Süre (dk)</label>
              <input
                type="number"
                required
                value={form.durationMin ?? 60}
                onChange={(e) =>
                  setForm({ ...form, durationMin: Number(e.target.value) })
                }
                className="w-full h-10 px-3 rounded-md border border-border"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span className="text-sm">Aktif</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-background"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-60 flex items-center gap-2"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
