import { BookingForm } from "./BookingForm";

type Service = {
  id: number;
  name: string;
  price: number | string;
  durationMin: number;
};

export function BookingSection({ services }: { services: Service[] }) {
  return (
    <section id="rezervasyon" className="py-20 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold mb-2 tracking-wide">
            REZERVASYON
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Randevu Almak Bu Kadar Kolay
          </h2>
          <p className="text-muted">
            Bilgilerinizi girin, müsait bir saat seçin, gerisini biz halledelim.
          </p>
        </div>
        <BookingForm services={services} />
      </div>
    </section>
  );
}
