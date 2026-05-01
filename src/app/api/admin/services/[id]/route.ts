import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { serviceSchema } from "@/lib/validators";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Geçersiz veri", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await prisma.service.update({
    where: { id: Number(id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const usedCount = await prisma.booking.count({
    where: { serviceId: Number(id) },
  });
  if (usedCount > 0) {
    await prisma.service.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });
    return NextResponse.json({
      ok: true,
      softDeleted: true,
      message: "Bu servisi kullanan rezervasyonlar var. Servis pasif yapıldı.",
    });
  }
  await prisma.service.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
