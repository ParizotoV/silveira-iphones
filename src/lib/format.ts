const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number | null | undefined): string | null {
  return typeof value === "number" ? brl.format(value) : null;
}

/** "256 GB" -> 256 · "1 TB" -> 1024 */
export function storageToGb(storage: string): number {
  const match = storage.match(/([\d.,]+)\s*(GB|TB)/i);
  if (!match) return 0;
  const value = Number.parseFloat(match[1].replace(",", "."));
  return match[2].toUpperCase() === "TB" ? value * 1024 : value;
}

/** Normaliza texto para busca (sem acentos, minúsculo). */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
