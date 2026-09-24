import type { ReactNode } from "react";
import { ButtonLink } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { buildWhatsAppUrl, GENERAL_MESSAGE } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  /** Mensagem pronta. Por padrão, a mensagem geral de atendimento. */
  message?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: boolean;
  children?: ReactNode;
  "aria-label"?: string;
}

/** CTA de conversão: todo link de WhatsApp do site nasce aqui (via lib/whatsapp). */
export function WhatsAppButton({
  message = GENERAL_MESSAGE,
  variant = "primary",
  size = "md",
  className,
  icon = true,
  children = "Falar com um especialista",
  ...rest
}: WhatsAppButtonProps) {
  return (
    <ButtonLink
      external
      href={buildWhatsAppUrl(message)}
      variant={variant}
      size={size}
      className={className}
      {...rest}
    >
      {icon && <WhatsAppIcon className="size-[1.1em] shrink-0" />}
      {children}
    </ButtonLink>
  );
}
