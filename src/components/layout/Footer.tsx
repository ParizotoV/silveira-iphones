import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div aria-hidden className="hairline-top absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Especialistas na comercialização de iPhones. Tecnologia, exclusividade e atendimento
              personalizado do primeiro contato à escolha do aparelho.
            </p>
            <WhatsAppButton className="mt-6" size="md">
              Falar com um especialista
            </WhatsAppButton>
          </div>

          <nav aria-label="Rodapé">
            <h2 className="font-mono text-[0.68rem] tracking-[0.28em] text-electric-soft uppercase">Navegação</h2>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.68rem] tracking-[0.28em] text-electric-soft uppercase">Atendimento</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              O atendimento é feito pelo WhatsApp. Envie o modelo de interesse e um especialista responde
              sobre disponibilidade e condições de compra.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p className="max-w-xl sm:text-right">
            iPhone é marca registrada da Apple Inc. A {site.name} é uma empresa independente, sem
            vínculo com a Apple Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
