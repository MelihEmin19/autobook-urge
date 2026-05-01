import { prisma } from "@/lib/prisma";
import { ServicesAdmin } from "@/components/ServicesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { id: "asc" } });

  const data = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: Number(s.price),
    durationMin: s.durationMin,
    isActive: s.isActive,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Servisler</h1>
        <p className="text-muted text-sm">
          Sunduğunuz bakım paketlerini düzenleyin, ekleyin veya pasif yapın.
        </p>
      </div>
      <ServicesAdmin initialServices={data} />
    </div>
  );
}
