import { cn } from "@/lib/format";

/**
 * Marca provisória da Silveira iPhones (monograma + logotipo tipográfico).
 * Substitua por um SVG oficial quando houver — mantenha o componente como
 * ponto único de uso (header e footer).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden
        className="relative grid size-9 place-items-center rounded-[11px] border border-electric-soft/40 bg-gradient-to-br from-[#0b1a44] to-ink shadow-[0_0_24px_-6px_rgba(0,77,208,0.9)]"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <path d="M16.5 7.2C15.6 5.9 14 5 12 5c-2.4 0-4 1.2-4 3 0 4.2 8.2 2.2 8.2 7 0 2-1.9 3.4-4.4 3.4-2.2 0-3.9-.9-4.9-2.4" />
        </svg>
        <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-electric-soft shadow-[0_0_8px_2px_rgba(77,134,240,0.9)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-semibold tracking-[0.18em] text-white">SILVEIRA</span>
        <span className="mt-1 font-mono text-[0.62rem] tracking-[0.42em] text-electric-soft uppercase">iPhones</span>
      </span>
    </span>
  );
}
