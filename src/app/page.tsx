import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { BookingSection } from "@/components/BookingSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, setting] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
    prisma.setting.findFirst(),
  ]);

  const settingData = setting ?? {
    garageName: process.env.GARAGE_NAME ?? "AutoBook Garage",
    phone: process.env.GARAGE_PHONE ?? "+44 1254 000 000",
    address:
      process.env.GARAGE_ADDRESS ?? "123 High Street, Blackburn BB1 1AA, UK",
  };

  const safeServices = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price.toString(),
    durationMin: s.durationMin,
  }));

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services services={safeServices} />
        <HowItWorks />
        <BookingSection services={safeServices} />
        <Contact setting={settingData} />
      </main>
      <Footer garageName={settingData.garageName} />
    </>
  );
}
