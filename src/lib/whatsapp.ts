import type { Product } from "@/data/types";

/**
 * Geração centralizada de links de atendimento por WhatsApp.
 * Todo CTA do site (header, hero, cards, produto, contato, footer, botão
 * flutuante) passa por aqui.
 *
 * Configure o número em `NEXT_PUBLIC_WHATSAPP_NUMBER` (somente dígitos, com
 * DDI+DDD, ex.: 5511999999999). Sem número configurado, o link abre o
 * WhatsApp com a mensagem pronta e o visitante escolhe o contato.
 */

/** Remove tudo que não for dígito. */
export function sanitizePhone(raw: string | undefined | null): string {
  return (raw ?? "").replace(/\D/g, "");
}

export function getWhatsAppNumber(): string {
  return sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}

export function isWhatsAppConfigured(): boolean {
  return getWhatsAppNumber().length >= 10;
}

export function buildWhatsAppUrl(message: string, phone: string = getWhatsAppNumber()): string {
  const text = encodeURIComponent(message);
  return phone.length >= 10 ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

/* --------------------------------------------------------------------------
   Mensagens
   -------------------------------------------------------------------------- */

export const GENERAL_MESSAGE =
  "Olá! Vim pelo site da Silveira iPhones e gostaria de atendimento personalizado para escolher meu próximo iPhone.";

export function buildProductMessage(
  product: Pick<Product, "id" | "name" | "storage" | "color" | "condition">,
): string {
  return [
    `Olá! Vi no site da Silveira iPhones o ${product.name} e gostaria de saber mais sobre disponibilidade e condições de compra.`,
    "",
    `Modelo: ${product.name}`,
    `Capacidade: ${product.storage}`,
    `Cor: ${product.color}`,
    `Condição: ${product.condition}`,
    `Ref.: ${product.id}`,
  ].join("\n");
}

export interface LeadInput {
  name?: string;
  model?: string;
  storage?: string;
  message?: string;
}

/** Mensagem do formulário de atendimento personalizado (página /contato). */
export function buildLeadMessage({ name, model, storage, message }: LeadInput): string {
  const lines = ["Olá! Vim pelo site da Silveira iPhones e gostaria de atendimento personalizado."];
  const details = [
    name?.trim() && `Nome: ${name.trim()}`,
    model?.trim() && `Modelo de interesse: ${model.trim()}`,
    storage?.trim() && `Capacidade: ${storage.trim()}`,
    message?.trim() && `Mensagem: ${message.trim()}`,
  ].filter(Boolean) as string[];

  if (details.length) lines.push("", ...details);
  return lines.join("\n");
}

export const whatsappUrls = {
  general: () => buildWhatsAppUrl(GENERAL_MESSAGE),
  product: (product: Parameters<typeof buildProductMessage>[0]) =>
    buildWhatsAppUrl(buildProductMessage(product)),
  lead: (input: LeadInput) => buildWhatsAppUrl(buildLeadMessage(input)),
};
