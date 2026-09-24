/**
 * URL pública do site, tolerante a valores ausentes, vazios ou sem protocolo
 * (ex.: "" ou "silveira.com.br"). Nunca lança erro: cai em localhost.
 */
function resolveSiteUrl(): string {
  const fallback = "http://localhost:3000";
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (!raw) return fallback;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}

export const site = {
  name: "Silveira iPhones",
  shortName: "Silveira",
  tagline: "Seu próximo iPhone começa aqui.",
  description:
    "Tecnologia, exclusividade e atendimento especializado para você escolher seu próximo iPhone. Explore a vitrine e fale com um especialista pelo WhatsApp.",
  url: resolveSiteUrl(),
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
