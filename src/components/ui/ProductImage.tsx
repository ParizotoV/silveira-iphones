import Image from "next/image";
import { PhoneArt, cameraLayoutFor, type PhoneView } from "./PhoneArt";
import type { Product } from "@/data/types";
import { cn } from "@/lib/format";

interface ProductImageProps {
  product: Pick<Product, "name" | "color" | "images">;
  /** Índice da imagem na galeria. */
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Mostra o selo "Imagem ilustrativa" quando for placeholder. */
  showPlaceholderBadge?: boolean;
}

/**
 * Renderiza a fotografia real do aparelho (/public/products) ou, na ausência
 * dela, uma ilustração de placeholder claramente identificada.
 */
export function ProductImage({
  product,
  index = 0,
  sizes,
  priority,
  className,
  showPlaceholderBadge = true,
}: ProductImageProps) {
  const src = product.images[index];

  if (src) {
    return (
      <Image
        src={src}
        alt={`${product.name} ${product.color}`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain", className)}
      />
    );
  }

  const view: PhoneView = index % 2 === 0 ? "back" : "front";

  return (
    <div className={cn("absolute inset-0 grid place-items-center", className)}>
      <PhoneArt
        color={product.color}
        view={view}
        cameras={cameraLayoutFor(product.name)}
        className="h-[82%] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
      />
      {showPlaceholderBadge && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.16em] whitespace-nowrap text-muted uppercase backdrop-blur">
          Imagem ilustrativa
        </span>
      )}
    </div>
  );
}
