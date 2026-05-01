"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type Service = {
  id: number;
  name: string;
  price: number | string;
  durationMin: number;
};

type Slot = {
  start: string;
  end: string;
  available: boolean;
};

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookingForm({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState<number>(services[0]?.id ?? 0);
  const [date, setDate] = useState(todayString());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { ok: true; code: string }
    | { ok: false; message: string }
    | null
  >(null);

  useEffect(() => {
    if (!serviceId || !date) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/slots?date=${date}&serviceId=${serviceId}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) {
      setResult({ ok: false, message: "Lütfen bir saat seçin" });
      return;
    }
    setSubmitting(true);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get("customerName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      plate: String(fd.get("plate") ?? ""),
      serviceId,
      slotStart: selectedSlot,
      note: String(fd.get("note") ?? ""),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.message ?? "Hata oluştu" });
      } else {
        setResult({ ok: true, code: data.code });
        (e.target as HTMLFormElement).reset();
        setSelectedSlot(null);
      }
    } catch {
      setResult({ ok: false, message: "Sunucu hatası" });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="bg-success/10 border border-success rounded-lg p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Rezervasyon Alındı</h3>
        <p className="text-muted mb-4">
          Rezervasyon kodunuz aşağıda. Onay e-postası gönderildi.
        </p>
        <div className="bg-surface inline-block px-6 py-4 rounded-md font-mono text-2xl font-bold tracking-wider border-2 border-success">
          {result.code}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`/rezervasyon/${result.code}`}
            className="bg-primary text-white px-5 py-2.5 rounded-md font-medium hover:bg-primary-dark"
          >
            Rezervasyonumu Görüntüle
          </a>
          <button
            onClick={() => setResult(null)}
            className="border border-border px-5 py-2.5 rounded-md font-medium hover:bg-background"
          >
            Yeni Rezervasyon
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl shadow-sm border border-border p-6 md:p-8 space-y-5"
    >
      {result && !result.ok && (
        <div className="flex items-center gap-2 bg-danger/10 border border-danger text-danger p-3 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <span>{result.message}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Ad-Soyad" name="customerName" required />
        <Field label="Telefon" name="phone" type="tel" required />
        <Field label="E-posta" name="email" type="email" required />
        <Field label="Plaka" name="plate" required placeholder="34 ABC 123" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Servis</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(Number(e.target.value))}
            className="w-full h-11 px-3 rounded-md border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            required
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - £{Number(s.price).toFixed(2)} ({s.durationMin} dk)
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Tarih"
          name="date"
          type="date"
          value={date}
          min={todayString()}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Saat</label>
        {loadingSlots ? (
          <div className="flex items-center gap-2 text-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Müsait saatler yükleniyor...</span>
          </div>
        ) : slots.length === 0 ? (
          <p className="text-muted text-sm">
            Bu gün müsait saat yok. Başka bir gün seçin.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {slots.map((s) => {
              const time = new Date(s.start).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const selected = selectedSlot === s.start;
              return (
                <button
                  type="button"
                  key={s.start}
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s.start)}
                  className={`py-2 rounded-md text-sm font-medium border transition ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : s.available
                        ? "bg-surface border-border hover:border-primary"
                        : "bg-background text-muted border-border opacity-50 cursor-not-allowed line-through"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Not (opsiyonel)
        </label>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 rounded-md border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          placeholder="Aracınız hakkında belirtmek istediğiniz bir not varsa..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !selectedSlot}
        className="w-full bg-accent text-primary-dark font-semibold py-3 rounded-md hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Gönderiliyor..." : "Rezervasyonu Tamamla"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  min,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  min?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={onChange}
        className="w-full h-11 px-3 rounded-md border border-border bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
    </div>
  );
}
