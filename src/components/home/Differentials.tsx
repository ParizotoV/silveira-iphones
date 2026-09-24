import { Headset, LayoutGrid, MessagesSquare, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  {
    icon: Headset,
    title: "Atendimento especializado",
    text: "Converse com quem entende de iPhone e tire suas dúvidas antes de decidir.",
  },
  {
    icon: Sparkles,
    title: "Experiência personalizada",
    text: "Cada cliente tem uma necessidade. Ajudamos você a encontrar o aparelho que combina com o seu uso.",
  },
  {
    icon: LayoutGrid,
    title: "Seleção de aparelhos",
    text: "Uma vitrine organizada por geração, capacidade e condição para você comparar com clareza.",
  },
  {
    icon: MessagesSquare,
    title: "Suporte durante a compra",
    text: "Acompanhamos você pelo WhatsApp, da primeira pergunta à confirmação das condições.",
  },
];

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Diferenciais"
            title={<span id="diferenciais">Uma loja pensada para quem valoriza tecnologia.</span>}
            description="Mais do que uma vitrine: um atendimento próximo para você escolher com segurança."
          />
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-electric-soft/45 hover:shadow-[0_24px_60px_-30px_rgba(0,77,208,0.8)] motion-reduce:transform-none">
                  <div aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full bg-electric/0 blur-3xl transition-colors duration-700 group-hover:bg-electric/30" />
                  <span className="relative grid size-12 place-items-center rounded-2xl border border-electric-soft/30 bg-electric/10 text-electric-soft transition-colors group-hover:bg-electric/25 group-hover:text-white">
                    <Icon className="size-5" aria-hidden strokeWidth={1.6} />
                  </span>
                  <h3 className="relative mt-6 font-display text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
