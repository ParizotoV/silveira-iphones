import Link from "next/link";
import { BatteryFull, Sparkles } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { Product } from "@/data/types";
import { cn, formatPrice } from "@/lib/format";
import { buildProductMessage } from "@/lib/whatsapp";

const conditionStyle: Record<Product["condition"], string> = {
  Novo: "border-electric-soft/40 bg-electric/15 text-[#9dbcff]",
  Seminovo: "border-white/15 bg-white/[0.06] text-white/85",
  Usado: "border-white/10 bg-white/[0.03] text-muted",
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const price = formatPrice(product.price);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1.5 hover:border-electric-soft/50 hover:shadow-[0_0_0_1px_rgba(77,134,240,0.35),0_28px_70px_-28px_rgba(0,77,208,0.7)] motion-reduce:transform-none",
        className,
      )}
    >
      {/* vitrine */}
      <div className="relative aspect-[5/5.4] overflow-hidden bg-[radial-gradient(90%_70%_at_50%_100%,rgba(0,77,208,0.32),transparent_70%),linear-gradient(180deg,#0e0e15,#08080c)]">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric-soft/60 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        <div className={cn("absolute inset-0 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.05] motion-reduce:transition-none", !product.available && "opacity-45 saturate-50")}>
          <ProductImage
            product={product}
            sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 92vw"
            priority={priority}
          />
        </div>

        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          {product.featured && product.available && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-soft/50 bg-electric/25 px-2.5 py-1 text-[0.68rem] font-medium text-white backdrop-blur">
              <Sparkles className="size-3" aria-hidden /> Destaque
            </span>
          )}
          {!product.available && (
            <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[0.68rem] font-medium text-white/80 backdrop-blur">
              Indisponível no momento
            </span>
          )}
        </div>
      </div>

      {/* informações */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="font-mono text-[0.65rem] tracking-[0.24em] text-electric-soft uppercase">
          {product.generation}
        </p>
        <h3 className="mt-1.5 font-display text-xl leading-tight font-semibold tracking-[-0.02em]">
          <Link
            href={`/iphones/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-[-3px]"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">
          {product.storage} <span aria-hidden>·</span> {product.color}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-xs", conditionStyle[product.condition])}>
            {product.condition}
          </span>
          {typeof product.batteryHealth === "number" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/85">
              <BatteryFull className="size-3.5 text-electric-soft" aria-hidden />
              Bateria {product.batteryHealth}%
            </span>
          )}
        </div>

        <div className="mt-auto pt-5">
          <p className={cn("font-display tracking-tight", price ? "text-2xl font-semibold" : "text-base font-medium text-white/80")}>
            {price ?? "Consulte o valor"}
          </p>
          <WhatsAppButton
            message={buildProductMessage(product)}
            variant="secondary"
            size="md"
            className="relative z-10 mt-3 w-full group-hover:border-electric-soft/60 group-hover:bg-electric group-hover:text-white"
            aria-label={`Consultar disponibilidade do ${product.name} ${product.storage} ${product.color} pelo WhatsApp`}
          >
            Consultar disponibilidade
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
