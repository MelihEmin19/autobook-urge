import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { settingSchema } from "@/lib/validators";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }

  const parsed = settingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Geçersiz veri", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.setting.findFirst();
  if (existing) {
    await prisma.setting.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    await prisma.setting.create({ data: parsed.data });
  }
  return NextResponse.json({ ok: true });
}
