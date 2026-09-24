/**
 * Mapeia o NOME da cor (como cadastrado em products.ts) para tons usados nas
 * ilustrações de placeholder. Cores não mapeadas caem em um grafite neutro.
 */
const palette: Record<string, string> = {
  "titanio natural": "#b8ada0",
  "titanio azul": "#3f4b66",
  "titanio preto": "#2b2c30",
  "titanio branco": "#d8d6d1",
  "titanio deserto": "#b89a7c",
  "azul-profundo": "#1f3f8f",
  "azul-nevoa": "#9db6d6",
  "azul-sierra": "#9bb5d2",
  azul: "#3b6fd4",
  ultramarino: "#4b5fe0",
  prateado: "#cfd1d6",
  rosa: "#eab2bf",
  "roxo-profundo": "#4a3a63",
  roxo: "#a793c9",
  "meia-noite": "#1b2130",
  estelar: "#e6e0d6",
  preto: "#1d1d21",
  "preto-espacial": "#2a2b30",
  branco: "#eeeeee",
  verde: "#7fa88a",
  "verde-acinzentado": "#5a8a8a",
  salvia: "#9caf98",
  lavanda: "#b9a9d8",
  amarelo: "#ecd97a",
  dourado: "#d9c29a",
  grafite: "#4a4b50",
  "laranja-cosmico": "#e0703a",
};

function key(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function colorHex(name: string): string {
  return palette[key(name)] ?? "#4a4b50";
}

/** Escurece (amount<0) ou clareia (amount>0) um hex. */
export function shade(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = (shift: number) => {
    const v = (n >> shift) & 255;
    const out = amount >= 0 ? v + (255 - v) * amount : v * (1 + amount);
    return Math.max(0, Math.min(255, Math.round(out)));
  };
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
}
