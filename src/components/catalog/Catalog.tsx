"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { Condition, Product, SortKey } from "@/data/types";
import { cn, normalize, storageToGb } from "@/lib/format";

interface CatalogProps {
  products: Product[];
  /** Gerações já ordenadas (mais recentes primeiro). */
  generations: string[];
}

const sortLabels: Record<SortKey, string> = {
  featured: "Destaques",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
};

const conditionOrder: Condition[] = ["Novo", "Seminovo", "Usado"];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function Catalog({ products, generations }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [gens, setGens] = useState<Set<string>>(new Set());
  const [storages, setStorages] = useState<Set<string>>(new Set());
  const [conditions, setConditions] = useState<Set<Condition>>(new Set());
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const storageOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.storage))).sort(
        (a, b) => storageToGb(a) - storageToGb(b),
      ),
    [products],
  );
  const conditionOptions = useMemo(
    () => conditionOrder.filter((c) => products.some((p) => p.condition === c)),
    [products],
  );

  const activeCount = gens.size + storages.size + conditions.size + (featuredOnly ? 1 : 0);

  const results = useMemo(() => {
    const tokens = normalize(deferredQuery).split(/\s+/).filter(Boolean);

    const filtered = products.filter((p) => {
      if (gens.size && !gens.has(p.generation)) return false;
      if (storages.size && !storages.has(p.storage)) return false;
      if (conditions.size && !conditions.has(p.condition)) return false;
      if (featuredOnly && !p.featured) return false;
      if (tokens.length) {
        const haystack = normalize(`${p.name} ${p.generation} ${p.color} ${p.storage} ${p.condition}`);
        if (!tokens.every((t) => haystack.includes(t))) return false;
      }
      return true;
    });

    const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
      // Sem preço cadastrado sempre por último.
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return (a.price - b.price) * dir;
    };

    return [...filtered].sort(
      sort === "price-asc"
        ? byPrice(1)
        : sort === "price-desc"
          ? byPrice(-1)
          : (a, b) =>
              Number(b.available) - Number(a.available) ||
              Number(b.featured) - Number(a.featured) ||
              generations.indexOf(a.generation) - generations.indexOf(b.generation),
    );
  }, [products, deferredQuery, gens, storages, conditions, featuredOnly, sort, generations]);

  const clearAll = () => {
    setQuery("");
    setGens(new Set());
    setStorages(new Set());
    setConditions(new Set());
    setFeaturedOnly(false);
    setSort("featured");
  };

  const filters = (
    <FilterGroups
      generations={generations}
      storageOptions={storageOptions}
      conditionOptions={conditionOptions}
      gens={gens}
      storages={storages}
      conditions={conditions}
      featuredOnly={featuredOnly}
      onGen={(v) => setGens((s) => toggle(s, v))}
      onStorage={(v) => setStorages((s) => toggle(s, v))}
      onCondition={(v) => setConditions((s) => toggle(s, v))}
      onFeatured={() => setFeaturedOnly((v) => !v)}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Filtros — desktop */}
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-24 rounded-3xl border border-line bg-surface/80 p-6 backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">Filtros</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="text-xs text-electric-soft hover:underline">
                Limpar
              </button>
            )}
          </div>
          {filters}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Busca + ordenação */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Buscar modelo</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-[1.1rem] -translate-y-1/2 text-muted" />
            <input
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar modelo, cor ou capacidade…"
              className="h-12 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-base text-white placeholder:text-muted/70 transition-[border-color,box-shadow] focus:border-electric-soft focus:shadow-[0_0_0_4px_rgba(0,77,208,0.25)] focus:outline-none"
            />
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="size-4 text-electric-soft" aria-hidden />
              Filtros
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-electric text-[0.7rem]">{activeCount}</span>
              )}
            </button>

            <label className="relative block flex-1 sm:flex-none">
              <span className="sr-only">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-12 w-full cursor-pointer appearance-none rounded-full border border-line bg-surface pr-10 pl-5 text-sm text-white focus:border-electric-soft focus:outline-none sm:w-48"
              >
                {Object.entries(sortLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
          </div>
        </div>

        {/* Filtros ativos + contagem */}
        <div className="mt-5 flex min-h-8 flex-wrap items-center gap-2">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-medium text-white">{results.length}</span>{" "}
            {results.length === 1 ? "aparelho encontrado" : "aparelhos encontrados"}
          </p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-electric-soft/50 hover:text-white lg:hidden"
            >
              <X className="size-3" aria-hidden /> Limpar filtros
            </button>
          )}
        </div>

        {/* Grade */}
        {results.length > 0 ? (
          <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((product, i) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="min-w-0"
                >
                  <ProductCard product={product} priority={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold tracking-tight">Nenhum aparelho com esses filtros</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Ajuste a busca ou fale com um especialista — ele pode verificar outras opções disponíveis para você.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={clearAll}
                className="h-12 rounded-full border border-line px-6 text-sm transition-colors hover:border-electric-soft/60"
              >
                Limpar filtros
              </button>
              <WhatsAppButton message="Olá! Vim pelo site da Silveira iPhones e não encontrei o aparelho que procuro. Podem me ajudar?">
                Pedir ajuda a um especialista
              </WhatsAppButton>
            </div>
          </div>
        )}
      </div>

      {/* Filtros — mobile */}
      <FilterSheet open={sheetOpen} onClose={closeSheet} onClear={clearAll} count={results.length}>
        {filters}
      </FilterSheet>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Grupos de filtro
   -------------------------------------------------------------------------- */

interface FilterGroupsProps {
  generations: string[];
  storageOptions: string[];
  conditionOptions: Condition[];
  gens: Set<string>;
  storages: Set<string>;
  conditions: Set<Condition>;
  featuredOnly: boolean;
  onGen: (v: string) => void;
  onStorage: (v: string) => void;
  onCondition: (v: Condition) => void;
  onFeatured: () => void;
}

function FilterGroups(p: FilterGroupsProps) {
  return (
    <div className="space-y-7">
      <Group title="Geração">
        {p.generations.map((g) => (
          <Chip key={g} active={p.gens.has(g)} onClick={() => p.onGen(g)}>
            {g}
          </Chip>
        ))}
      </Group>
      <Group title="Capacidade">
        {p.storageOptions.map((s) => (
          <Chip key={s} active={p.storages.has(s)} onClick={() => p.onStorage(s)}>
            {s}
          </Chip>
        ))}
      </Group>
      <Group title="Condição">
        {p.conditionOptions.map((c) => (
          <Chip key={c} active={p.conditions.has(c)} onClick={() => p.onCondition(c)}>
            {c}
          </Chip>
        ))}
      </Group>
      <Group title="Vitrine">
        <Chip active={p.featuredOnly} onClick={p.onFeatured}>
          Somente destaques
        </Chip>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-mono text-[0.65rem] tracking-[0.26em] text-muted uppercase">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm transition-[background-color,border-color,color,box-shadow] duration-300",
        active
          ? "border-electric-soft/70 bg-electric text-white shadow-[0_0_24px_-6px_rgba(0,77,208,0.95)]"
          : "border-line bg-transparent text-white/80 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------------------
   Sheet mobile
   -------------------------------------------------------------------------- */

function FilterSheet({
  open,
  onClose,
  onClear,
  count,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  count: number;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[2rem] border-t border-line bg-surface"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="font-display text-xl font-semibold tracking-tight">Filtros</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar filtros"
                className="grid size-10 place-items-center rounded-full border border-line"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-4">{children}</div>
            <div className="flex gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={onClear} className="h-12 flex-1 rounded-full border border-line text-sm">
                Limpar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-[1.6] rounded-full bg-electric text-sm font-medium shadow-[0_10px_30px_-10px_rgba(0,77,208,0.95)]"
              >
                Ver {count} {count === 1 ? "aparelho" : "aparelhos"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
