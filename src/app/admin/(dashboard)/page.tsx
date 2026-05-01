import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime, statusLabel } from "@/lib/utils";
import { CalendarDays, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayCount, pendingCount, totalCount, todayBookings] =
    await Promise.all([
      prisma.booking.count({
        where: {
          slotStart: { gte: today, lt: tomorrow },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count(),
      prisma.booking.findMany({
        where: { slotStart: { gte: today, lt: tomorrow } },
        include: { service: true },
        orderBy: { slotStart: "asc" },
      }),
    ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted text-sm">Bugünkü rezervasyonlar ve genel durum</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card
          icon={<CalendarDays className="w-6 h-6" />}
          label="Bugün"
          value={todayCount}
          color="bg-primary"
        />
        <Card
          icon={<AlertCircle className="w-6 h-6" />}
          label="Bekleyen"
          value={pendingCount}
          color="bg-warning"
        />
        <Card
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="Toplam"
          value={totalCount}
          color="bg-success"
        />
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold">Bugünkü Rezervasyonlar</h2>
          <Link
            href="/admin/rezervasyonlar"
            className="text-sm text-primary hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        {todayBookings.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Bugün için rezervasyon yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-muted">
                <tr>
                  <Th>Saat</Th>
                  <Th>Müşteri</Th>
                  <Th>Servis</Th>
                  <Th>Plaka</Th>
                  <Th>Durum</Th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((b) => {
                  const st = statusLabel(b.status);
                  return (
                    <tr
                      key={b.id}
                      className="border-t border-border hover:bg-background/50"
                    >
                      <Td>
                        {new Date(b.slotStart).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Td>
                      <Td>
                        <div>{b.customerName}</div>
                        <div className="text-xs text-muted">{b.phone}</div>
                      </Td>
                      <Td>{b.service.name}</Td>
                      <Td className="font-mono">{b.plate}</Td>
                      <Td>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}
                        >
                          {st.label}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-5 flex items-center gap-4">
      <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-medium px-6 py-3 whitespace-nowrap">
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
  return <td className={`px-6 py-3 ${className}`}>{children}</td>;
}
