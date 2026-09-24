import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGenerations, getProducts } from "@/data/repository";

export async function Generations() {
  const [generations, products] = await Promise.all([getGenerations(), getProducts()]);

  return (
    <section aria-labelledby="geracoes" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title={<span id="geracoes">Escolha pela geração.</span>}
            description="Cada geração traz uma proposta diferente. Compare e encontre a que faz mais sentido para você."
          />
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {generations.map((generation, i) => {
            const count = products.filter((p) => p.generation === generation).length;
            return (
              <li key={generation}>
                <Reveal delay={i * 0.06} className="h-full">
                  <Link
                    href="/iphones"
                    className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-500 hover:border-electric-soft/50 hover:shadow-[0_20px_50px_-24px_rgba(0,77,208,0.9)] sm:p-6"
                  >
                    <div aria-hidden className="absolute inset-x-0 -bottom-10 h-28 bg-[radial-gradient(closest-side,rgba(0,77,208,0.4),transparent)] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                    <ArrowUpRight className="relative size-5 self-end text-muted transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden />
                    <div className="relative">
                      <p className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{generation}</p>
                      <p className="mt-1 text-xs text-muted">
                        {count} {count === 1 ? "modelo na vitrine" : "modelos na vitrine"}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
