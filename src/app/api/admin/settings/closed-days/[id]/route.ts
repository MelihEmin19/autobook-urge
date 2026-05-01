import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.closedDay.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
