import { z } from "zod";

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Ad-Soyad en az 2 karakter").max(120),
  phone: z.string().min(7, "Telefon hatalı").max(30),
  email: z.email("Geçerli bir e-posta girin").max(160),
  plate: z.string().min(3, "Plaka hatalı").max(20),
  serviceId: z.coerce.number().int().positive(),
  slotStart: z.string().min(1, "Tarih/saat seçin"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Parolayı girin"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(1000),
  price: z.coerce.number().nonnegative(),
  durationMin: z.coerce.number().int().positive(),
  isActive: z.coerce.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const settingSchema = z.object({
  garageName: z.string().min(1).max(120),
  phone: z.string().min(1).max(30),
  address: z.string().min(1).max(300),
  slotMinutes: z.coerce.number().int().positive(),
});

export type SettingInput = z.infer<typeof settingSchema>;

export const businessHoursSchema = z.array(
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string().regex(/^\d{2}:\d{2}$/),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean(),
  })
);
