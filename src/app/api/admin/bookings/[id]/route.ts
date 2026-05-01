import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const ALLOWED = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

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

  if (!ALLOWED.includes(body.status)) {
    return NextResponse.json({ message: "Geçersiz durum" }, { status: 400 });
  }

  await prisma.booking.update({
    where: { id: Number(id) },
    data: { status: body.status },
  });

  return NextResponse.json({ ok: true });
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
  await prisma.booking.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
