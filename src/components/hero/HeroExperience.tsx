"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Iphone3D, PHONE } from "@/components/device/Iphone3D";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { usePrefersReducedMotion, useViewport } from "@/lib/hooks";

/**
 * Experiência cinematográfica do hero — controlada 100% pelo scroll.
 *
 * Linha do tempo (progresso 0 → 1 da seção "pinada"):
 *   0.00  aparelho flutuando (traseira), texto de abertura
 *   0.22  início da rotação 3D (o aparelho revela seus ângulos)
 *   0.44  gira em direção à frente · tela apagada
 *   0.54  frente alcançada → a tela começa a acender
 *   0.64  tela acesa + aproximação (profundidade)
 *   0.78  aparelho se desloca para a direita · texto comercial entra
 *   0.90  composição final equilibrada (segura até 1.0)
 *
 * O progresso passa por uma mola (useSpring): a animação é suavizada e volta
 * aos estados anteriores ao rolar para cima.
 */

/* Marcos de progresso (compartilhados por todas as propriedades). */
const P = [0, 0.12, 0.22, 0.34, 0.44, 0.54, 0.64, 0.78, 0.9, 1];

const ROTATE_Y = [166, 164, 150, 100, 44, 4, 0, -6, -14, -14];
const ROTATE_X = [12, 12, 16, 10, 6, 2, 0, -2, -4, -4];
const ROTATE_Z = [-8, -8, -10, -5, -2, 0, 0, 0, 0, 0];

/* Desktop: aparelho migra para a direita e o texto ocupa a esquerda. */
const D_SCALE = [0.82, 0.82, 0.88, 0.94, 0.97, 1, 1.16, 1.16, 1.02, 1.02];
const D_X = ["0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "22vw", "22vw"];
const D_Y = ["-4vh", "-4vh", "-3vh", "-2vh", "-1vh", "0vh", "0vh", "0vh", "0vh", "0vh"];

/* Mobile/tablet vertical: aparelho sobe e o texto ocupa a parte inferior. */
const M_SCALE = [0.9, 0.9, 0.94, 0.97, 0.99, 1, 1.1, 1.1, 0.8, 0.8];
const M_X = ["0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw"];
const M_Y = ["0vh", "0vh", "0vh", "0vh", "0vh", "0vh", "0vh", "0vh", "-17vh", "-17vh"];

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .8 0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>",
)}")`;

const STARS = [
  [8, 14, 0], [18, 72, 1.2], [26, 30, 2.4], [34, 86, 0.6], [44, 8, 3.1], [57, 90, 1.8],
  [66, 22, 0.3], [74, 64, 2.7], [83, 12, 1.5], [91, 78, 3.6], [95, 36, 0.9], [12, 50, 2.1],
] as const;

export function HeroExperience() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { w, h } = useViewport();
  const stacked = w < 1024;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0004,
  });
  // Com "reduzir movimento" a animação continua sob controle do usuário (scroll),
  // mas sem a mola de suavização e sem os movimentos automáticos (CSS os desliga).
  const progress = reduced ? scrollYProgress : smooth;

  /* ---- Estados derivados do progresso ---------------------------------- */
  const rotateY = useTransform(progress, P, ROTATE_Y);
  const rotateX = useTransform(progress, P, ROTATE_X);

  /* ---- Interação: no estágio final o aparelho "olha" para o cursor/dedo ---- */
  const phoneRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const followX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.4 });
  const followY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.4 });
  const interact = useTransform(progress, [0.86, 0.96], [0, 1], { clamp: true });
  const amp = reduced ? 0.5 : 1;
  const tiltY = useTransform([rotateY, followX, interact], ([r, m, k]: number[]) => r + m * k * 26 * amp);
  const tiltX = useTransform([rotateX, followY, interact], ([r, m, k]: number[]) => r - m * k * 15 * amp);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = phoneRef.current?.getBoundingClientRect();
    if (!box) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    // Normaliza pelo espaço disponível de cada lado: o alcance do giro é simétrico
    // mesmo com o aparelho deslocado para a direita.
    const axis = (pos: number, center: number, size: number) => {
      const d = pos - center;
      return clamp(d / Math.max(1, (d < 0 ? center : size - center) * 0.8));
    };
    pointerX.set(axis(e.clientX, box.left + box.width / 2, window.innerWidth));
    pointerY.set(axis(e.clientY, box.top + box.height / 2, window.innerHeight));
  };
  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };
  const rotateZ = useTransform(progress, P, ROTATE_Z);

  const scaleD = useTransform(progress, P, D_SCALE);
  const scaleM = useTransform(progress, P, M_SCALE);
  const xD = useTransform(progress, P, D_X);
  const xM = useTransform(progress, P, M_X);
  const yD = useTransform(progress, P, D_Y);
  const yM = useTransform(progress, P, M_Y);

  const screenOn = useTransform(progress, [0.46, 0.62], [0, 1], { clamp: true });
  const sheen = useTransform(tiltY, [-16, 0, 60, 170], ["70%", "48%", "30%", "16%"]);

  const rim = useTransform(tiltY, [-16, 0, 40, 90, 140, 170], [0.25, 0, 0.45, 1, 0.55, 0.15]);
  const streakOpacity = useTransform(progress, [0.42, 0.56, 0.7, 0.85], [0, 0.85, 0.45, 0.2]);
  const streakScale = useTransform(progress, [0.42, 0.6, 1], [0.3, 1, 1.1]);

  const glowOpacity =useTransform(progress, P, [0.5, 0.5, 0.58, 0.66, 0.76, 0.86, 1, 1, 0.92, 0.92]);
  const glowScale = useTransform(progress, P, [0.8, 0.8, 0.86, 0.92, 1, 1.05, 1.18, 1.18, 1.08, 1.08]);
  const glowShift = useTransform(tiltY, [-16, 0, 170], [-60, 0, 70]);
  const ringRotate = useTransform(progress, [0, 1], [0, 150]);
  const ringOpacity = useTransform(progress, [0, 0.2, 0.9], [0.35, 0.6, 0.35]);
  const floorOpacity = useTransform(progress, [0, 0.5, 0.64], [0.7, 0.85, 1]);

  /* Texto de abertura */
  const introOpacity = useTransform(progress, [0, 0.09, 0.19], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.19], [0, -36]);
  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  /* Texto comercial (etapa 5) */
  const copyOpacity = useTransform(progress, [0.78, 0.9], [0, 1]);
  const copyX = useTransform(progress, [0.78, 0.9], [-36, 0]);
  const copyY = useTransform(progress, [0.78, 0.9], [stacked ? 28 : 0, 0]);
  const ctaOpacity = useTransform(progress, [0.84, 0.95], [0, 1]);
  const ctaY = useTransform(progress, [0.84, 0.95], [22, 0]);

  const barScale = useTransform(progress, [0, 1], [0, 1]);

  /* Só permite foco/clique nos botões quando eles estão visíveis. */
  const [interactive, setInteractive] = useState(false);
  useMotionValueEvent(progress, "change", (v) => setInteractive(v > 0.8));

  /* ---- Enquadramento --------------------------------------------------- */
  const fit = stacked
    ? Math.min((h * 0.52) / PHONE.H, (w * 0.72) / PHONE.W)
    : Math.min((h * 0.62) / PHONE.H, (w * 0.3) / PHONE.W);

  const scale = stacked ? scaleM : scaleD;
  const x = stacked ? xM : xD;
  const y = stacked ? yM : yD;

  return (
    <section
      ref={ref}
      data-hero
      aria-label="Apresentação da Silveira iPhones"
      className="relative h-[380svh] lg:h-[430svh]"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-ink"
        // pan-y: o scroll vertical segue normal e o arrasto horizontal gira o aparelho
        style={{ touchAction: "pan-y" }}
        onPointerMove={onPointerMove}
        onPointerLeave={resetPointer}
        onPointerUp={resetPointer}
        onPointerCancel={resetPointer}
      >
        {/* ---------- Fundo ---------- */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
          {!stacked &&
            STARS.map(([left, top, delay], i) => (
              <span
                key={i}
                className="anim-twinkle absolute size-[3px] rounded-full bg-electric-soft"
                style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
              />
            ))}
        </div>

        {/* ---------- Palco do aparelho ---------- */}
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          {/* halo azul atrás do aparelho */}
          <motion.div
            style={{ opacity: glowOpacity, scale: glowScale, x: glowShift }}
            className="absolute size-[min(120vw,1000px)] rounded-full bg-[radial-gradient(closest-side,rgba(0,77,208,0.5),rgba(0,77,208,0.16)_48%,transparent_72%)] will-change-transform"
          />

          {/* raia de luz anamórfica quando a tela acende */}
          <motion.div
            style={{ opacity: streakOpacity, scaleX: streakScale }}
            className="absolute h-[2px] w-[min(120vw,1100px)] bg-gradient-to-r from-transparent via-[#8fb4ff] to-transparent blur-[2px]"
          />

          {/* anel técnico discreto */}
          <motion.svg
            viewBox="0 0 800 800"
            style={{ rotate: ringRotate, opacity: ringOpacity }}
            className="absolute size-[min(105vw,860px)] text-electric-soft"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="400" cy="400" r="398" strokeOpacity="0.18" />
            <circle cx="400" cy="400" r="330" strokeOpacity="0.28" strokeDasharray="2 14" strokeLinecap="round" />
            <circle cx="400" cy="400" r="266" strokeOpacity="0.2" />
            <path d="M400 2v18M400 780v18M2 400h18M780 400h18" strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M118 118l12 12M682 118l-12 12M118 682l12-12M682 682l-12-12" strokeOpacity="0.3" />
          </motion.svg>

          <div ref={phoneRef} style={{ transform: `scale(${fit})` }} className="relative">
            <motion.div style={{ scale }} className="relative" >
              {/* sombra/reflexo no "chão" */}
              <motion.div
                style={{ opacity: floorOpacity, top: PHONE.H + 30 }}
                className="absolute left-1/2 -ml-[210px] h-[74px] w-[420px]"
              >
                <div className="anim-shadow size-full rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,77,208,0.6),rgba(0,0,0,0.5)_55%,transparent)] blur-[6px]" />
              </motion.div>

              {/* flutuação + perspectiva */}
              <div className="anim-float" style={{ perspective: 1600 }}>
                <motion.div
                  style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    rotateZ,
                    transformStyle: "preserve-3d",
                    width: PHONE.W,
                    height: PHONE.H,
                  }}
                >
                  <Iphone3D screenOn={screenOn} sheen={sheen} rim={rim} detail={stacked ? "low" : "high"} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- Acabamento de câmera: vinheta + grão de filme ---------- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.55))]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        {/* ---------- Transição para a vitrine ---------- */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <motion.div style={{ scaleX: barScale }} className="hairline-top h-px origin-left" />
        </div>
        {/* ---------- Etapa 1 · abertura ---------- */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-5 pt-24 pb-14 text-center sm:pt-28 lg:pb-14"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.5em] text-electric-soft uppercase sm:text-xs">
            Silveira iPhones
          </p>
          <div>
            <h1 className="font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              <span className="text-gradient">Seu próximo iPhone</span>
              <br className="sm:hidden" /> <span className="text-gradient">começa aqui.</span>
            </h1>
            <motion.div style={{ opacity: cueOpacity }} className="mt-6 flex flex-col items-center gap-3">
              <span className="font-mono text-[0.62rem] tracking-[0.3em] text-muted uppercase">
                Role para explorar
              </span>
              <span className="relative h-9 w-px overflow-hidden bg-white/15">
                <span className="anim-cue absolute inset-0 bg-electric-soft" />
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ---------- Etapa 5 · texto comercial ---------- */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-9 sm:px-8 lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-[6vw] lg:w-[min(40rem,46vw)] lg:-translate-y-1/2 lg:px-0 lg:pb-0">
          <motion.div style={{ opacity: copyOpacity, x: copyX, y: copyY }}>
            <p className="hidden font-mono text-xs tracking-[0.32em] text-electric-soft uppercase lg:block">
              Silveira iPhones
            </p>
            <h2 className="font-display text-[clamp(1.85rem,6.6vw,3.1rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance lg:mt-5 lg:text-[clamp(2.4rem,4.2vw,4.1rem)]">
              <span className="block">Seu próximo iPhone</span>
              <span className="text-gradient block">começa aqui.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-muted sm:text-lg lg:mt-6">
              Tecnologia, exclusividade e atendimento especializado para você escolher seu próximo iPhone.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: interactive ? "auto" : "none" }}
            className="mt-5 lg:mt-9"
            aria-hidden={!interactive}
            inert={!interactive}
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <ButtonLink href="/iphones" size="md" className="w-full sm:w-auto">
                Explorar iPhones
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              <WhatsAppButton variant="secondary" size="md" className="w-full sm:w-auto">
                Falar com um especialista
              </WhatsAppButton>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
