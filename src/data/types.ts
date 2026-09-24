/**
 * Modelo de dados dos produtos da Silveira iPhones.
 *
 * Este arquivo é a única "fonte de verdade" para o formato de um aparelho.
 * Ao migrar para banco de dados ou CMS, basta que a nova fonte devolva
 * objetos neste formato (veja `src/data/repository.ts`).
 */

export type Condition = "Novo" | "Seminovo" | "Usado";

export interface UnitInfoItem {
  /** Rótulo exibido, ex.: "Garantia" */
  label: string;
  /** Valor exibido, ex.: "Confirmar no atendimento" */
  value: string;
}

export interface Product {
  /** Identificador interno estável (usado na mensagem de WhatsApp). */
  id: string;
  /** Parte final da URL: /iphones/[slug]. Minúsculas, sem acentos, com hífens. */
  slug: string;
  /** Nome comercial do modelo, ex.: "iPhone 16 Pro Max". */
  name: string;
  /** Geração usada no filtro, ex.: "iPhone 16". */
  generation: string;
  /** Capacidade, ex.: "256 GB" ou "1 TB". */
  storage: string;
  /** Cor, ex.: "Titânio Natural". */
  color: string;
  condition: Condition;
  /** Saúde da bateria em %. Informar SOMENTE quando conferida na unidade. */
  batteryHealth?: number | null;
  /** Preço em reais. `null` = "Consulte o valor". */
  price: number | null;
  /**
   * Caminhos a partir de /public (ex.: "/products/iphone-16-pro-max-1.webp").
   * Vazio = a interface exibe uma ilustração (placeholder) sinalizada como tal.
   */
  images: string[];
  featured: boolean;
  available: boolean;
  /** Texto curto opcional sobre a unidade. */
  notes?: string;
  /**
   * Informações comerciais CONFIRMADAS da unidade (garantia, nota fiscal,
   * acessórios incluídos...). Nada é exibido se o campo não for preenchido.
   */
  unitInfo?: UnitInfoItem[];
}

/** Características técnicas de referência do modelo (não da unidade). */
export interface ModelSpecs {
  chip: string;
  display: string;
  cameras: string;
  connector: string;
  highlights: string[];
}

export type SortKey = "featured" | "price-asc" | "price-desc";
