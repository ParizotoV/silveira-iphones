import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "font-mono text-[0.7rem] tracking-[0.28em] text-electric-soft uppercase",
          align === "center" && "justify-center",
          "inline-flex items-center gap-3",
        )}
      >
        <span aria-hidden className="h-px w-8 bg-electric-soft/60" />
        {eyebrow}
      </p>
      <Tag className="mt-4 font-display text-[clamp(1.9rem,4.6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
