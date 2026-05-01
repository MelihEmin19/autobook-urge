import { Check } from "lucide-react";
import { formatGBP } from "@/lib/utils";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  durationMin: number;
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="servisler" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wide">
            FİYATLANDIRMA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            İki Net Bakım Paketi
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Aracınızın ihtiyacına göre seçin. Tüm fiyatlar KDV dahil, ek ücret
            yok.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, idx) => (
            <div
              key={s.id}
              className={`bg-surface rounded-xl shadow-sm p-8 border ${
                idx === 1 ? "border-accent ring-2 ring-accent/20" : "border-border"
              }`}
            >
              {idx === 1 && (
                <span className="inline-block bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full mb-3">
                  ÖNERİLEN
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{s.name}</h3>
              <p className="text-muted mb-4">{s.description}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatGBP(Number(s.price))}
                </span>
                <span className="text-muted">/ {s.durationMin} dk</span>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Sabit fiyat garantisi
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Sertifikalı uzman ekip
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  E-posta ile randevu onayı
                </li>
              </ul>

              <a
                href={`#rezervasyon?serviceId=${s.id}`}
                className="block w-full text-center bg-primary text-white font-semibold px-4 py-3 rounded-md hover:bg-primary-dark transition"
              >
                Bu Servisi Seç
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
