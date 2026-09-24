import type { Metadata } from "next";
import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/home/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getProducts } from "@/data/repository";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Silveira iPhones pelo WhatsApp e solicite um atendimento personalizado para escolher seu próximo iPhone.",
  alternates: { canonical: "/contato" },
  openGraph: { url: "/contato", title: "Contato | Silveira iPhones" },
};

export default async function ContatoPage() {
  const products = await getProducts();
  const models = Array.from(new Set(products.map((p) => p.name)));

  return (
    <div className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,77,208,0.28),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Contato"
            title="Vamos encontrar o seu iPhone."
            description="O atendimento é feito pelo WhatsApp. Chame agora ou preencha os dados abaixo para começar com a mensagem pronta."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <Reveal className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-electric-soft/30 bg-surface p-8 sm:p-10">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_80%_at_0%_100%,rgba(0,77,208,0.5),transparent_70%)]" />
              <div className="relative flex h-full flex-col">
                <span className="grid size-12 place-items-center rounded-2xl border border-electric-soft/40 bg-electric/20 text-white">
                  <MessageCircle className="size-5" aria-hidden />
                </span>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Atendimento direto pelo WhatsApp</h2>
                <p className="mt-3 text-muted">
                  Envie o modelo que você procura e um especialista responde com informações sobre disponibilidade e
                  condições de compra.
                </p>
                <WhatsAppButton size="lg" className="mt-8 w-full sm:w-auto sm:self-start">
                  Falar com um especialista
                </WhatsAppButton>

                <ul className="mt-10 space-y-4 border-t border-white/10 pt-8 text-sm text-muted">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-electric-soft" aria-hidden />
                    Sem cadastro e sem pagamento no site.
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-electric-soft" aria-hidden />
                    Horários de atendimento confirmados diretamente na conversa.
                  </li>
                </ul>

                {!isWhatsAppConfigured() && process.env.NODE_ENV !== "production" && (
                  <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
                    Modo desenvolvimento: defina NEXT_PUBLIC_WHATSAPP_NUMBER no arquivo .env.local para que os links
                    abram a conversa com o número da loja.
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-line bg-surface p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Solicitar atendimento personalizado</h2>
              <p className="mt-2 mb-8 text-sm text-muted">Todos os campos são opcionais.</p>
              <LeadForm models={models} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
