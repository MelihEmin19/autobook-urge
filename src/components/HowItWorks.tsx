import { ListChecks, CalendarCheck, Wrench } from "lucide-react";

const STEPS = [
  {
    Icon: ListChecks,
    title: "1. Servisi Seç",
    text: "Standart veya tam bakımdan ihtiyacına uygun olanı seç.",
  },
  {
    Icon: CalendarCheck,
    title: "2. Tarih ve Saat Belirle",
    text: "Müsait saat dilimlerinden sana uyanı işaretle, formu doldur.",
  },
  {
    Icon: Wrench,
    title: "3. Garajda Buluşalım",
    text: "Aracını belirlediğin saatte getir, biz halledelim.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wide">
            NASIL ÇALIŞIR
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">3 Adımda Randevu</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map(({ Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
