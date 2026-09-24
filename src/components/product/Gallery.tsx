"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product } from "@/data/types";
import { cn } from "@/lib/format";

/** Galeria: imagem principal + miniaturas. Sem fotos reais, exibe ilustrações (traseira/frente). */
export function Gallery({ product }: { product: Pick<Product, "name" | "color" | "images"> }) {
  const count = Math.max(product.images.length, 2);
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/4.6] overflow-hidden rounded-[2rem] border border-line bg-[radial-gradient(80%_60%_at_50%_100%,rgba(0,77,208,0.4),transparent_70%),linear-gradient(180deg,#0e0e15,#07070b)] sm:aspect-[5/5]">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductImage product={product} index={active} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Imagens do aparelho">
          {Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1} de ${count}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300",
                  i === active
                    ? "border-electric-soft shadow-[0_0_28px_-8px_rgba(0,77,208,1)]"
                    : "border-line hover:border-white/25",
                )}
              >
                <ProductImage product={product} index={i} sizes="120px" showPlaceholderBadge={false} className="scale-90" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
