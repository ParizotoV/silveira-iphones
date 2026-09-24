export const site = {
  name: "Silveira iPhones",
  shortName: "Silveira",
  tagline: "Seu próximo iPhone começa aqui.",
  description:
    "Tecnologia, exclusividade e atendimento especializado para você escolher seu próximo iPhone. Explore a vitrine e fale com um especialista pelo WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "pt_BR",
} as const;

export const nav = [
  { href: "/", label: "Início" },
  { href: "/iphones", label: "iPhones" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Serializa JSON-LD com segurança para <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
