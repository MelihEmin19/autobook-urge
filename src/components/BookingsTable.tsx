"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { STATUS_OPTIONS, formatDateTime, statusLabel } from "@/lib/utils";

type Booking = {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  email: string;
  plate: string;
  serviceName: string;
  slotStart: string;
  slotEnd: string;
  status: string;
  note: string | null;
};

export function BookingsTable({
  bookings,
  initialStatus,
  initialFrom,
  initialTo,
}: {
  bookings: Booking[];
  initialStatus: string;
  initialFrom: string;
  initialTo: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  function applyFilter(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`/admin/rezervasyonlar?${params.toString()}`);
  }

  async function updateStatus(id: number, newStatus: string) {
    startTransition(async () => {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    });
  }

  return (
    <>
      <form
        onSubmit={applyFilter}
        className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-4 grid sm:grid-cols-4 gap-3"
      >
        <div>
          <label className="block text-xs font-medium mb-1 text-muted">Durum</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-surface"
          >
            <option value="ALL">Tümü</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-muted">Başlangıç</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-surface"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-muted">Bitiş</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-surface"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 h-10 bg-primary text-white rounded-md font-medium hover:bg-primary-dark"
          >
            Filtrele
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/rezervasyonlar")}
            className="h-10 px-4 border border-border rounded-md hover:bg-background text-sm"
          >
            Sıfırla
          </button>
        </div>
      </form>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-muted">
            Kayıt bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-muted">
                <tr>
                  <Th>Kod</Th>
                  <Th>Tarih/Saat</Th>
                  <Th>Müşteri</Th>
                  <Th>İletişim</Th>
                  <Th>Plaka</Th>
                  <Th>Servis</Th>
                  <Th>Durum</Th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const st = statusLabel(b.status);
                  return (
                    <tr
                      key={b.id}
                      className="border-t border-border hover:bg-background/40"
                    >
                      <Td className="font-mono text-xs">{b.code}</Td>
                      <Td>{formatDateTime(b.slotStart)}</Td>
                      <Td>{b.customerName}</Td>
                      <Td>
                        <div>{b.phone}</div>
                        <div className="text-xs text-muted">{b.email}</div>
                      </Td>
                      <Td className="font-mono">{b.plate}</Td>
                      <Td>{b.serviceName}</Td>
                      <Td>
                        <select
                          value={b.status}
                          disabled={pending}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${st.color}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
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
