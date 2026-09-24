import type { Metadata } from "next";
import { Cpu, HeartHandshake, MessageCircle, Search } from "lucide-react";
import { CtaBand } from "@/components/home/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sobre a Silveira iPhones",
  description:
    "Conheça a Silveira iPhones: especialistas na comercialização de iPhones, com atendimento personalizado do primeiro contato à escolha do aparelho.",
  alternates: { canonical: "/sobre" },
  openGraph: { url: "/sobre", title: "Sobre | Silveira iPhones" },
};

const principles = [
  {
    icon: Cpu,
    title: "Foco em iPhone",
    text: "Somos especializados na comercialização de iPhones. É nisso que concentramos nosso conhecimento e nossa atenção.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento próximo",
    text: "Você conversa com uma pessoa, não com um formulário. Tiramos dúvidas e orientamos a escolha de acordo com o seu perfil.",
  },
  {
    icon: Search,
    title: "Informação clara",
    text: "Modelo, capacidade, cor e condição de cada aparelho apresentados de forma objetiva, para você comparar com tranquilidade.",
  },
];

const steps = [
  { n: "01", title: "Explore a vitrine", text: "Navegue pelos aparelhos, filtre por geração, capacidade e condição." },
  { n: "02", title: "Chame no WhatsApp", text: "Com um toque, você envia o modelo de interesse já com os detalhes na mensagem." },
  { n: "03", title: "Converse com um especialista", text: "Confirme disponibilidade e condições de compra diretamente com a equipe." },
];

export default function SobrePage() {
  return (
    <div className="relative pt-32 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,77,208,0.28),transparent_70%)]" />

      <section className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Sobre"
            title="Tecnologia premium, atendimento de verdade."
            description="A Silveira iPhones nasceu para tornar a escolha do seu próximo iPhone mais simples, segura e agradável — com uma vitrine clara e um atendimento que acompanha você."
          />
        </Reveal>

        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-surface p-8 transition-[border-color,box-shadow] duration-500 hover:border-electric-soft/45 hover:shadow-[0_24px_60px_-30px_rgba(0,77,208,0.8)]">
                  <span className="grid size-12 place-items-center rounded-2xl border border-electric-soft/30 bg-electric/10 text-electric-soft">
                    <Icon className="size-5" aria-hidden strokeWidth={1.6} />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-semibold tracking-tight">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="como-funciona" className="relative mx-auto mt-28 max-w-7xl px-5 sm:mt-36 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Como funciona" title={<span id="como-funciona">Do primeiro toque à decisão.</span>} />
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8">
                  <span aria-hidden className="absolute -top-2 right-5 font-display text-7xl font-semibold text-white/[0.04]">
                    {s.n}
                  </span>
                  <p className="font-mono text-xs tracking-[0.3em] text-electric-soft">{s.n}</p>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <MessageCircle className="size-4 text-electric-soft" aria-hidden />
          Não há carrinho nem pagamento no site: toda a negociação acontece pelo WhatsApp.
        </p>
      </section>

      <div className="mt-28 sm:mt-36">
        <CtaBand />
      </div>
    </div>
  );
}
