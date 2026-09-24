"use client";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl, GENERAL_MESSAGE } from "@/lib/whatsapp";

/** Botão flutuante discreto — o WhatsApp está sempre a um toque de distância. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Aparece após o início da rolagem. Na home, espera o hero terminar: lá os
  // CTAs já estão na tela e o botão cobriria os botões do final da animação.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (pathname === "/") {
      const hero = document.querySelector("[data-hero]");
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setVisible(heroBottom < window.innerHeight * 0.55);
    } else {
      setVisible(y > 240);
    }
  });

  return (
    <motion.a
      href={buildWhatsAppUrl(GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16, scale: visible ? 1 : 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      tabIndex={visible ? 0 : -1}
      className="fixed right-4 bottom-4 z-40 grid size-13 place-items-center rounded-full border border-electric-soft/50 bg-electric text-white shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_10px_36px_-6px_rgba(0,77,208,0.95)] transition-colors hover:bg-[#0a5ce8] sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
    </motion.a>
  );
}
