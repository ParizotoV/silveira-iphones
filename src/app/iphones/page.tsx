import type { Metadata } from "next";
import { Catalog } from "@/components/catalog/Catalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGenerations, getProducts } from "@/data/repository";
import { isDemoCatalog } from "@/data/products";
import { absoluteUrl, jsonLd } from "@/lib/site";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "iPhones disponíveis",
  description:
    "Explore a vitrine da Silveira iPhones: filtre por geração, capacidade e condição e consulte a disponibilidade pelo WhatsApp.",
  alternates: { canonical: "/iphones" },
  openGraph: { url: "/iphones", title: "iPhones disponíveis | Silveira iPhones" },
};

export default async function IphonesPage() {
  const [products, generations] = await Promise.all([getProducts(), getGenerations()]);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/iphones/${p.slug}`),
      name: `${p.name} ${p.storage} ${p.color}`,
    })),
  };

  return (
    <div className="relative pt-32 pb-24 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,77,208,0.28),transparent_70%)]" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listLd) }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Vitrine"
          title="iPhones selecionados para você."
          description="Filtre por geração, capacidade e condição. Encontrou o seu? Um especialista confirma disponibilidade e condições de compra pelo WhatsApp."
        />

        {isDemoCatalog && (
          <p className="mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-electric-soft/25 bg-electric/[0.08] px-4 py-3 text-sm text-[#b9cdfa]">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Vitrine com <strong className="font-semibold text-white">dados de demonstração</strong>. Modelos, preços e
              condições exibidos são ilustrativos e não representam o estoque real da loja.
            </span>
          </p>
        )}

        <div className="mt-10">
          <Catalog products={products} generations={generations} />
        </div>
      </div>
    </div>
  );
}
