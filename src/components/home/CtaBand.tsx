import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ButtonLink } from "@/components/ui/Button";

/** Chamada final: atendimento personalizado pelo WhatsApp. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-final" className="relative px-5 pb-24 sm:px-8 sm:pb-32">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-electric-soft/30 bg-surface px-6 py-16 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_120%,rgba(0,77,208,0.65),transparent_70%)]" />
          <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
          <div aria-hidden className="hairline-top absolute inset-x-0 top-0" />

          <div className="relative">
            <p className="font-mono text-[0.7rem] tracking-[0.3em] text-electric-soft uppercase">Atendimento personalizado</p>
            <h2 id="cta-final" className="mx-auto mt-5 max-w-3xl font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance">
              Conte o que você procura. A gente encontra o iPhone certo.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
              Fale com um especialista da Silveira iPhones e receba orientação sobre disponibilidade e condições de compra.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton size="lg" className="w-full sm:w-auto">
                Falar com um especialista
              </WhatsAppButton>
              <ButtonLink href="/iphones" variant="secondary" size="lg" className="w-full sm:w-auto">
                Explorar iPhones
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
