import { prisma } from "./prisma";

/**
 * Tek bir slot bilgisi. Slot, müsait veya dolu olarak işaretlenir.
 */
export type Slot = { start: Date; end: Date; available: boolean };

/**
 * Verilen tarih ve servis için müsait randevu slotlarını üretir.
 *
 * Algoritma:
 *  1. Günün haftalık çalışma saatlerini ve kapalı gün listesini sorgular.
 *  2. Açılış-kapanış arasında {slotMinutes} aralıklarla cursor ilerletir.
 *  3. Her cursor pozisyonunda servis süresi kadar bir slot oluşturur.
 *  4. Geçmiş zamanlı slotları ve var olan rezervasyonlarla çakışan slotları
 *     "available: false" olarak işaretler.
 *
 * @param date Slotların hesaplanacağı tarih
 * @param serviceId Servis ID'si (servisin durationMin alanı slot uzunluğunu belirler)
 * @returns Slot dizisi; gün kapalıysa veya servis bulunamazsa boş dizi
 */
export async function getAvailableSlots(
  date: Date,
  serviceId: number
): Promise<Slot[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const dayOfWeek = dayStart.getDay();

  const [hours, closedDay, service, setting, existing] = await Promise.all([
    prisma.businessHour.findUnique({ where: { dayOfWeek } }),
    prisma.closedDay.findUnique({ where: { date: dayStart } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.setting.findFirst(),
    prisma.booking.findMany({
      where: {
        slotStart: { gte: dayStart, lt: dayEnd },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { slotStart: true, slotEnd: true },
    }),
  ]);

  if (!hours || hours.isClosed || closedDay || !service) return [];

  const slotMin = setting?.slotMinutes ?? 30;
  const [oh, om] = hours.openTime.split(":").map(Number);
  const [ch, cm] = hours.closeTime.split(":").map(Number);

  const open = new Date(dayStart);
  open.setHours(oh, om, 0, 0);
  const close = new Date(dayStart);
  close.setHours(ch, cm, 0, 0);

  const slots: Slot[] = [];
  const cursor = new Date(open);

  const now = new Date();

  while (cursor.getTime() + service.durationMin * 60000 <= close.getTime()) {
    const start = new Date(cursor);
    const end = new Date(start.getTime() + service.durationMin * 60000);

    const isPast = start.getTime() < now.getTime();

    const overlaps = existing.some(
      (b) =>
        start.getTime() < b.slotEnd.getTime() &&
        end.getTime() > b.slotStart.getTime()
    );

    slots.push({
      start,
      end,
      available: !isPast && !overlaps,
    });

    cursor.setMinutes(cursor.getMinutes() + slotMin);
  }

  return slots;
}
