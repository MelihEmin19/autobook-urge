import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { serviceSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Geçersiz veri", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const created = await prisma.service.create({ data: parsed.data });
  return NextResponse.json(created);
}
