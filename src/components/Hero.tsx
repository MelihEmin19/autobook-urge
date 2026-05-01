import { Calendar, ShieldCheck, Clock } from "lucide-react";

export function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative bg-gradient-to-br from-primary-dark to-primary text-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent font-semibold mb-3 tracking-wide">
            ARAÇ SERVİS REZERVASYONU
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Aracınızın Bakımı Tek Tıkla Randevuda
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Garajımızda iki sabit fiyatlı bakım paketinden birini seçin, uygun
            saati belirleyin, online rezervasyon yapın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#rezervasyon"
              className="bg-accent text-primary-dark font-semibold px-6 py-3 rounded-md hover:brightness-95 transition text-center"
            >
              Hemen Rezervasyon Yap
            </a>
            <a
              href="#servisler"
              className="border border-white/30 text-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition text-center"
            >
              Servisleri Gör
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur p-5 rounded-lg">
            <Calendar className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Online Randevu</h3>
            <p className="text-sm text-white/70">
              Form doldur, dakikalar içinde rezervasyon kodu al.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-5 rounded-lg">
            <ShieldCheck className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Sabit Fiyat</h3>
            <p className="text-sm text-white/70">
              Sürpriz yok. Fiyatlar net, ön ödeme yok.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-5 rounded-lg">
            <Clock className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Hızlı Hizmet</h3>
            <p className="text-sm text-white/70">
              Standart bakım 60 dk, tam bakım 120 dk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
