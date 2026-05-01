import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = Number(searchParams.get("serviceId"));

  if (!date || !serviceId) {
    return NextResponse.json(
      { message: "date ve serviceId gerekli" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(new Date(date), serviceId);
    return NextResponse.json({ slots });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Slotlar yüklenemedi" },
      { status: 500 }
    );
  }
}
