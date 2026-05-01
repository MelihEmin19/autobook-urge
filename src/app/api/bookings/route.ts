import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";
import { generateBookingCode } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Form bilgilerinde hata var",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId, isActive: true },
    });
    if (!service) {
      return NextResponse.json(
        { message: "Servis bulunamadı" },
        { status: 404 }
      );
    }

    const slotStart = new Date(data.slotStart);
    if (slotStart.getTime() < Date.now()) {
      return NextResponse.json(
        { message: "Geçmiş bir saat seçilemez" },
        { status: 400 }
      );
    }
    const slotEnd = new Date(slotStart.getTime() + service.durationMin * 60000);

    const overlap = await prisma.booking.findFirst({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [
          { slotStart: { lt: slotEnd } },
          { slotEnd: { gt: slotStart } },
        ],
      },
    });
    if (overlap) {
      return NextResponse.json(
        { message: "Seçilen saat dolu, lütfen başka bir saat seçin" },
        { status: 409 }
      );
    }

    let code = generateBookingCode();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.booking.findUnique({ where: { code } });
      if (!exists) break;
      code = generateBookingCode();
    }

    const booking = await prisma.booking.create({
      data: {
        code,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        plate: data.plate.toUpperCase(),
        serviceId: data.serviceId,
        slotStart,
        slotEnd,
        status: "PENDING",
        note: data.note ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      code: booking.code,
      slotStart: booking.slotStart,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
