import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL ?? "admin@autobook.local";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD ?? "Admin!2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Admin" },
    create: { email: adminEmail, passwordHash, name: "Admin" },
  });

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: "Standart Bakim",
          description:
            "Yag degisimi, yag filtresi, hava filtresi, genel kontrol. Yaklasik 60 dakika surer.",
          price: 79.0,
          durationMin: 60,
          isActive: true,
        },
        {
          name: "Tam Bakim",
          description:
            "Standart bakima ek olarak fren kontrolu, aku testi, klima gazi ve detayli arac taramasi. Yaklasik 120 dakika surer.",
          price: 149.0,
          durationMin: 120,
          isActive: true,
        },
      ],
    });
  }

  const settingCount = await prisma.setting.count();
  if (settingCount === 0) {
    await prisma.setting.create({
      data: {
        garageName: process.env.GARAGE_NAME ?? "AutoBook Garage",
        phone: process.env.GARAGE_PHONE ?? "+44 1254 000 000",
        address:
          process.env.GARAGE_ADDRESS ??
          "123 High Street, Blackburn BB1 1AA, UK",
        slotMinutes: 30,
      },
    });
  }

  const hours = [
    { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
    { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "14:00", isClosed: false },
  ];

  for (const h of hours) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    });
  }

  console.log("Seed tamamlandi.");
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
  console.log("   Servisler: Standart Bakim (£79), Tam Bakim (£149)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
