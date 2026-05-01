import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "E-posta veya parola hatalı" },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: parsed.data.email },
    });
    if (!user) {
      return NextResponse.json(
        { message: "E-posta veya parola hatalı" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { message: "E-posta veya parola hatalı" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
