import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isDemoCatalog } from "@/data/products";
import { getFeaturedProducts } from "@/data/repository";

/** Vitrine da home: continuação natural do hero (entra com halo azul vindo de cima). */
export async function Showcase() {
  const featured = await getFeaturedProducts(4);
  if (!featured.length) return null;

  return (
    <section aria-labelledby="destaques" className="relative pt-8 pb-24 sm:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(50%_70%_at_50%_0%,rgba(0,77,208,0.3),transparent_72%)]" />
      <div aria-hidden className="hairline-top absolute inset-x-0 top-0" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Em destaque"
              title={<span id="destaques">A vitrine da Silveira.</span>}
              description="Uma seleção de aparelhos para começar. Toque em um modelo para ver detalhes ou consulte a disponibilidade."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/iphones"
              className="group inline-flex items-center gap-2 text-sm font-medium text-electric-soft transition-colors hover:text-white"
            >
              Ver todos os iPhones
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product, i) => (
            <li key={product.id}>
              <Reveal delay={i * 0.07} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>

        {isDemoCatalog && (
          <p className="mt-6 text-xs text-muted">
            Dados de demonstração: modelos, preços e condições são ilustrativos.
          </p>
        )}
      </div>
    </section>
  );
}
