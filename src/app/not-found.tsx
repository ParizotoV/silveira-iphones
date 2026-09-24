import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center px-5 pt-32 pb-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_40%,rgba(0,77,208,0.28),transparent_70%)]" />
      <div className="relative">
        <p className="font-mono text-xs tracking-[0.4em] text-electric-soft uppercase">Erro 404</p>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,4rem)] leading-tight font-semibold tracking-[-0.035em]">
          Esta página não foi encontrada.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          O aparelho ou a página que você procura pode ter saído da vitrine. Veja os iPhones disponíveis.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/iphones" size="lg">Explorar iPhones</ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">Voltar ao início</ButtonLink>
        </div>
      </div>
    </section>
  );
}
