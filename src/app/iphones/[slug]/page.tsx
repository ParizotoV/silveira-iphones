import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BatteryFull, ChevronLeft, ShieldQuestion } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Gallery } from "@/components/product/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { isDemoCatalog } from "@/data/products";
import { getModelSpecs, getProductBySlug, getProducts, getRelatedProducts } from "@/data/repository";
import type { Product } from "@/data/types";
import { cn, formatPrice } from "@/lib/format";
import { absoluteUrl, jsonLd } from "@/lib/site";
import { buildProductMessage } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/iphones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} ${product.storage} ${product.color}`;
  const price = formatPrice(product.price);
  const description = `${title} — ${product.condition}${
    typeof product.batteryHealth === "number" ? `, bateria ${product.batteryHealth}%` : ""
  }. ${price ? `${price}. ` : ""}Consulte disponibilidade e condições de compra com a Silveira iPhones pelo WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/iphones/${product.slug}` },
    openGraph: { type: "website", url: `/iphones/${product.slug}`, title: `${title} | Silveira iPhones`, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

function productJsonLd(product: Product) {
  const url = absoluteUrl(`/iphones/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.storage} ${product.color}`,
    sku: product.id,
    color: product.color,
    brand: { "@type": "Brand", name: "Apple" },
    itemCondition:
      product.condition === "Novo" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    url,
    ...(product.images.length ? { image: product.images.map((i) => absoluteUrl(i)) } : {}),
    ...(typeof product.price === "number"
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "BRL",
            price: product.price,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };
}

export default async function ProductPage({ params }: PageProps<"/iphones/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 3);
  const specs = getModelSpecs(product);
  const price = formatPrice(product.price);
  const hasBattery = typeof product.batteryHealth === "number";

  const unitRows: Array<[string, string]> = [
    ["Modelo", product.name],
    ["Geração", product.generation],
    ["Capacidade", product.storage],
    ["Cor", product.color],
    ["Condição", product.condition],
    ...(hasBattery ? ([["Saúde da bateria", `${product.batteryHealth}%`]] as Array<[string, string]>) : []),
    ["Referência", product.id],
  ];

  return (
    <div className="relative pt-28 pb-24 sm:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(55%_55%_at_70%_0%,rgba(0,77,208,0.26),transparent_70%)]" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productJsonLd(product)) }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <nav aria-label="Você está em">
          <Link href="/iphones" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white">
            <ChevronLeft className="size-4" aria-hidden /> Todos os iPhones
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal y={16} className="lg:sticky lg:top-28 lg:self-start">
            <Gallery product={product} />
          </Reveal>

          <Reveal delay={0.08} y={16}>
            <p className="font-mono text-xs tracking-[0.28em] text-electric-soft uppercase">{product.generation}</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.03] font-semibold tracking-[-0.035em] text-balance">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-muted">
              {product.storage} <span aria-hidden>·</span> {product.color}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Pill>{product.condition}</Pill>
              <Pill tone={product.available ? "ok" : "off"}>
                {product.available ? "Consulte disponibilidade" : "Indisponível no momento"}
              </Pill>
            </div>

            {hasBattery && (
              <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 text-sm text-muted">
                    <BatteryFull className="size-4 text-electric-soft" aria-hidden /> Saúde da bateria
                  </p>
                  <p className="font-display text-2xl font-semibold tracking-tight">{product.batteryHealth}%</p>
                </div>
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
                  role="progressbar"
                  aria-label="Saúde da bateria"
                  aria-valuenow={product.batteryHealth ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-electric to-electric-soft shadow-[0_0_14px_rgba(77,134,240,0.8)]"
                    style={{ width: `${product.batteryHealth}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-8">
              <p className="text-sm text-muted">{price ? "Valor" : "Valor sob consulta"}</p>
              <p className={cn("mt-1 font-display tracking-tight", price ? "text-4xl font-semibold" : "text-2xl font-medium text-white/85")}>
                {price ?? "Consulte o valor"}
              </p>
              {isDemoCatalog && (
                <p className="mt-2 text-xs text-muted">Valor de demonstração — não representa o preço real da loja.</p>
              )}
              <WhatsAppButton message={buildProductMessage(product)} size="lg" className="mt-6 w-full sm:w-auto">
                Consultar disponibilidade
              </WhatsAppButton>
            </div>

            {/* Informações comerciais confirmadas */}
            <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
              <h2 className="text-sm font-medium">Informações da unidade</h2>
              {product.unitInfo?.length ? (
                <dl className="mt-3 divide-y divide-line">
                  {product.unitInfo.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-muted">{item.label}</dt>
                      <dd className="text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-electric-soft" aria-hidden />
                  Garantia, procedência, itens inclusos e formas de pagamento são confirmados diretamente com um
                  especialista no atendimento.
                </p>
              )}
              {product.notes && <p className="mt-3 border-t border-line pt-3 text-sm text-muted">{product.notes}</p>}
            </div>
          </Reveal>
        </div>

        {/* Especificações */}
        <Reveal className="mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Ficha técnica</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SpecCard title="Esta unidade" rows={unitRows} />
            {specs ? (
              <SpecCard
                title={`Características do ${product.name}`}
                rows={[
                  ["Chip", specs.chip],
                  ["Tela", specs.display],
                  ["Câmeras", specs.cameras],
                  ["Conector", specs.connector],
                  ["Destaques", specs.highlights.join(" · ")],
                ]}
                footnote="Especificações de referência do modelo, conforme dados públicos do fabricante. Confirme detalhes da unidade no atendimento."
              />
            ) : null}
          </div>
        </Reveal>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-24" aria-labelledby="relacionados">
            <div className="flex items-end justify-between gap-4">
              <h2 id="relacionados" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Você também pode gostar
              </h2>
              <Link href="/iphones" className="text-sm text-electric-soft hover:underline">
                Ver todos
              </Link>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <Reveal className="h-full">
                    <ProductCard product={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "ok" | "off" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        tone === "neutral" && "border-electric-soft/40 bg-electric/15 text-[#9dbcff]",
        tone === "ok" && "border-white/15 bg-white/[0.05] text-white/85",
        tone === "off" && "border-white/10 text-muted",
      )}
    >
      {children}
    </span>
  );
}

function SpecCard({ title, rows, footnote }: { title: string; rows: Array<[string, string]>; footnote?: string }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6">
      <h3 className="font-mono text-[0.68rem] tracking-[0.26em] text-electric-soft uppercase">{title}</h3>
      <dl className="mt-4 divide-y divide-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-sm">
            <dt className="text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {footnote && <p className="mt-4 text-xs leading-relaxed text-muted">{footnote}</p>}
    </div>
  );
}
