import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

const DAY_NAMES = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export default async function AdminSettingsPage() {
  const [setting, hours, closed] = await Promise.all([
    prisma.setting.findFirst(),
    prisma.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.closedDay.findMany({ orderBy: { date: "asc" } }),
  ]);

  const hoursData = Array.from({ length: 7 }).map((_, i) => {
    const found = hours.find((h) => h.dayOfWeek === i);
    return {
      dayOfWeek: i,
      name: DAY_NAMES[i],
      openTime: found?.openTime ?? "09:00",
      closeTime: found?.closeTime ?? "18:00",
      isClosed: found?.isClosed ?? false,
    };
  });

  const closedData = closed.map((c) => ({
    id: c.id,
    date: c.date.toISOString().slice(0, 10),
    reason: c.reason,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-muted text-sm">
          Garaj bilgileri, çalışma saatleri ve kapalı günler.
        </p>
      </div>

      <SettingsForm
        initialSetting={
          setting ?? {
            garageName: "",
            phone: "",
            address: "",
            slotMinutes: 30,
          }
        }
        initialHours={hoursData}
        initialClosed={closedData}
      />
    </div>
  );
}
