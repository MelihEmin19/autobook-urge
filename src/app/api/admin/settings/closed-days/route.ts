import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }

  const { date, reason } = await req.json();
  if (!date) {
    return NextResponse.json({ message: "Tarih gerekli" }, { status: 400 });
  }

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  await prisma.closedDay.upsert({
    where: { date: d },
    update: { reason: reason || null },
    create: { date: d, reason: reason || null },
  });

  return NextResponse.json({ ok: true });
}
