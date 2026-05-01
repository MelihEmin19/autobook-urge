import { Phone, MapPin, Clock } from "lucide-react";

type Setting = {
  garageName: string;
  phone: string;
  address: string;
};

export function Contact({ setting }: { setting: Setting }) {
  return (
    <section id="iletisim" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wide">
            İLETİŞİM
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Bize Ulaşın</h2>
          <p className="text-muted">
            Sorularınız için doğrudan arayabilir veya garaja uğrayabilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-lg shadow-sm border border-border text-center">
            <Phone className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-1">Telefon</h3>
            <a
              href={`tel:${setting.phone.replace(/\s+/g, "")}`}
              className="text-primary hover:underline"
            >
              {setting.phone}
            </a>
          </div>

          <div className="bg-surface p-6 rounded-lg shadow-sm border border-border text-center">
            <MapPin className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-1">Adres</h3>
            <p className="text-muted text-sm">{setting.address}</p>
          </div>

          <div className="bg-surface p-6 rounded-lg shadow-sm border border-border text-center">
            <Clock className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
            <p className="text-muted text-sm">Pzt-Cuma 09:00-18:00</p>
            <p className="text-muted text-sm">Cumartesi 09:00-14:00</p>
            <p className="text-muted text-sm">Pazar Kapalı</p>
          </div>
        </div>

        <div className="mt-10 rounded-lg overflow-hidden shadow-sm border border-border">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              setting.address
            )}&output=embed`}
            className="w-full h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Konum Haritası"
          />
        </div>
      </div>
    </section>
  );
}
