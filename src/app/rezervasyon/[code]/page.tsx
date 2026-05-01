import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatDateTime, formatGBP, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const [booking, setting] = await Promise.all([
    prisma.booking.findUnique({
      where: { code: code.toUpperCase() },
      include: { service: true },
    }),
    prisma.setting.findFirst(),
  ]);

  if (!booking) notFound();

  const status = statusLabel(booking.status);
  const garageName = setting?.garageName ?? "AutoBook";

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <div className="text-center mb-6">
              <p className="text-primary font-semibold tracking-wide">
                REZERVASYON DURUMU
              </p>
              <h1 className="text-3xl font-bold mt-2">{booking.code}</h1>
            </div>

            <div className="flex justify-center mb-6">
              <span
                className={`inline-block px-4 py-1.5 rounded-full font-semibold text-sm ${status.color}`}
              >
                {status.label}
              </span>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="Müşteri" value={booking.customerName} />
              <Row label="Telefon" value={booking.phone} />
              <Row label="E-posta" value={booking.email} />
              <Row label="Plaka" value={booking.plate} />
              <Row label="Servis" value={booking.service.name} />
              <Row
                label="Tarih ve Saat"
                value={formatDateTime(booking.slotStart)}
              />
              <Row label="Süre" value={`${booking.service.durationMin} dakika`} />
              <Row
                label="Ücret"
                value={formatGBP(Number(booking.service.price))}
              />
              {booking.note && <Row label="Not" value={booking.note} />}
            </dl>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-primary hover:underline font-medium">
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </main>
      <Footer garageName={garageName} />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}
