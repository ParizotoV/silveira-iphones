import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight whitespace-nowrap select-none transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--ease-premium)] active:scale-[0.98] motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-white shadow-[0_0_0_1px_rgba(77,134,240,0.45),0_12px_40px_-12px_rgba(0,77,208,0.95)] hover:bg-[#0a5ce8] hover:shadow-[0_0_0_1px_rgba(120,165,255,0.7),0_16px_54px_-10px_rgba(0,77,208,1)]",
  whatsapp:
    "bg-electric text-white shadow-[0_0_0_1px_rgba(77,134,240,0.45),0_12px_40px_-12px_rgba(0,77,208,0.95)] hover:bg-[#0a5ce8] hover:shadow-[0_0_0_1px_rgba(120,165,255,0.7),0_16px_54px_-10px_rgba(0,77,208,1)]",
  secondary:
    "border border-white/12 bg-white/[0.04] text-white backdrop-blur-md hover:border-electric-soft/60 hover:bg-white/[0.08] hover:shadow-[0_0_32px_-10px_rgba(0,77,208,0.9)]",
  ghost: "text-white/80 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

/** Reflexo que atravessa o botão no hover (apenas variantes cheias). */
const Sheen = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-[var(--ease-premium)] group-hover/btn:left-[130%] group-hover/btn:opacity-100 motion-reduce:hidden"
  />
);

interface ButtonLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const filled = variant === "primary" || variant === "whatsapp";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {filled && <Sheen />}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {filled && <Sheen />}
      {children}
    </Link>
  );
}
