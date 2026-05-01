/**
 * Rezervasyon için 8 haneli alfanumerik benzersiz kod üretir.
 * Karışıklık yapan karakterler (0, O, 1, I) hariç tutulmuştur.
 *
 * @returns 8 karakterli büyük harf-rakam kodu (örn. "UQJR5AYA")
 * @example
 * const code = generateBookingCode(); // "ABCD1234"
 */
export function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Sayı veya string değeri İngiliz Sterlini (£) biçiminde formatlar.
 *
 * @param value Formatlanacak fiyat
 * @returns "£79.00" formatında string
 */
export function formatGBP(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(num);
}

/**
 * Tarih/saat değerini Türkçe okunabilir formata çevirir.
 *
 * @param d Date objesi veya ISO string
 * @returns "01 Mayıs 2026 09:00" formatında string
 */
export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Rezervasyon durum koduna karşılık gelen etiket ve Tailwind renk sınıfını döner.
 *
 * @param status PENDING | CONFIRMED | COMPLETED | CANCELLED
 * @returns label ve color (Tailwind class) içeren obje
 */
export function statusLabel(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case "PENDING":
      return { label: "Bekliyor", color: "bg-amber-100 text-amber-800" };
    case "CONFIRMED":
      return { label: "Onaylı", color: "bg-emerald-100 text-emerald-800" };
    case "COMPLETED":
      return { label: "Tamamlandı", color: "bg-sky-100 text-sky-800" };
    case "CANCELLED":
      return { label: "İptal", color: "bg-rose-100 text-rose-800" };
    default:
      return { label: status, color: "bg-slate-100 text-slate-800" };
  }
}

export const STATUS_OPTIONS = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "CONFIRMED", label: "Onaylı" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "İptal" },
] as const;
