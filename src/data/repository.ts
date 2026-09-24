import { modelSpecs } from "./models";
import { products } from "./products";
import type { ModelSpecs, Product } from "./types";

/**
 * Camada de acesso a dados.
 *
 * Todas as páginas e componentes leem produtos SOMENTE por aqui. As funções
 * são assíncronas de propósito: para migrar para banco de dados ou CMS basta
 * trocar o corpo delas (ex.: `fetch`, Prisma, Sanity...) sem alterar a UI.
 */

if (process.env.NODE_ENV !== "production") {
  const slugs = new Set<string>();
  for (const p of products) {
    if (slugs.has(p.slug)) throw new Error(`[products] slug duplicado: ${p.slug}`);
    slugs.add(p.slug);
  }
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.featured && p.available).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const score = (p: Product) =>
    (p.generation === product.generation ? 2 : 0) +
    (p.name === product.name ? 1 : 0) +
    (p.available ? 1 : 0);

  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function getModelSpecs(product: Product): ModelSpecs | undefined {
  return modelSpecs[product.name];
}

export async function getGenerations(): Promise<string[]> {
  const gens = Array.from(new Set(products.map((p) => p.generation)));
  return gens.sort((a, b) => generationNumber(b) - generationNumber(a));
}

/** "iPhone 16" -> 16 (ordenação decrescente: mais recentes primeiro). */
export function generationNumber(generation: string): number {
  const match = generation.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}
