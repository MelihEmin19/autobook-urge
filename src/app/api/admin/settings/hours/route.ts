import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { businessHoursSchema } from "@/lib/validators";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = businessHoursSchema.safeParse(body.hours);
  if (!parsed.success) {
    return NextResponse.json({ message: "Geçersiz veri" }, { status: 400 });
  }

  for (const h of parsed.data) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    });
  }

  return NextResponse.json({ ok: true });
}
