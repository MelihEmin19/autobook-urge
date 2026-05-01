import { prisma } from "@/lib/prisma";
import { BookingsTable } from "@/components/BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;

  const where: Record<string, unknown> = {};
  if (sp.status && sp.status !== "ALL") where.status = sp.status;
  if (sp.from || sp.to) {
    const range: Record<string, Date> = {};
    if (sp.from) range.gte = new Date(sp.from);
    if (sp.to) {
      const t = new Date(sp.to);
      t.setHours(23, 59, 59, 999);
      range.lte = t;
    }
    where.slotStart = range;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true },
    orderBy: { slotStart: "desc" },
    take: 200,
  });

  const data = bookings.map((b) => ({
    id: b.id,
    code: b.code,
    customerName: b.customerName,
    phone: b.phone,
    email: b.email,
    plate: b.plate,
    serviceName: b.service.name,
    slotStart: b.slotStart.toISOString(),
    slotEnd: b.slotEnd.toISOString(),
    status: b.status,
    note: b.note,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rezervasyonlar</h1>
        <p className="text-muted text-sm">
          Tüm rezervasyonlar (en yeni 200 kayıt). Filtre uygulayabilir, durum
          güncelleyebilirsiniz.
        </p>
      </div>

      <BookingsTable
        bookings={data}
        initialStatus={sp.status ?? "ALL"}
        initialFrom={sp.from ?? ""}
        initialTo={sp.to ?? ""}
      />
    </div>
  );
}
