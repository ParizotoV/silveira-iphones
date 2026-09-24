"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { IphoneBack } from "./IphoneBack";
import { PHONE } from "./phone-constants";
import { ScreenWallpaper } from "./ScreenWallpaper";

/**
 * iPhone tridimensional feito em CSS 3D (sem WebGL, sem arquivos externos).
 *
 * Construção:
 *  - Corpo: fatias arredondadas empilhadas em Z (dão os cantos curvos do
 *    chassi vistos de qualquer ângulo) + quatro faces planas nas laterais
 *    (evitam "frestas" quando o aparelho é visto de perfil).
 *  - Frente: vidro com moldura preta, ilha de sensores e tela.
 *  - Traseira: acabamento fosco, módulo de câmeras com relevo real (Z).
 *
 * Tudo é controlado por MotionValues vindas do scroll — nenhum re-render.
 * Para trocar por um modelo GLB real, veja docs/EXPERIENCIA-3D.md.
 */

export { PHONE };
const { W, H, T, R } = PHONE;

/* Luminosidade do chassi ao longo da espessura (t: -1..1): chanfros claros
   nas bordas, faixa escura ao centro e um brilho especular discreto. */
function railLightness(t: number) {
  const a = Math.abs(t);
  const bevel = Math.exp(-(((a - 0.94) / 0.065) ** 2));
  const mid = Math.exp(-((t / 0.22) ** 2));
  const edge = Math.exp(-(((a - 0.6) / 0.14) ** 2)); // transição chanfro → faixa plana
  return 15 + 54 * bevel + 15 * mid - 5 * edge;
}
const railColor = (t: number) => `hsl(219 34% ${railLightness(t).toFixed(1)}%)`;

/* Cortes de antena (finos e escuros) perto das extremidades da lateral. */
const antennaV =
  "linear-gradient(180deg, transparent 5.5%, rgba(6,10,22,.55) 5.5% 6.1%, transparent 6.1% 93.9%, rgba(6,10,22,.55) 93.9% 94.5%, transparent 94.5%)";
const antennaH =
  "linear-gradient(90deg, transparent 9%, rgba(6,10,22,.55) 9% 9.8%, transparent 9.8% 90.2%, rgba(6,10,22,.55) 90.2% 91%, transparent 91%)";

/* Escovado fino no sentido do comprimento (anisotropia do metal). */
const brushed =
  "repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px)";

const railGradient =`linear-gradient(90deg, ${Array.from({ length: 15 }, (_, i) => {
  const t = (i / 14) * 2 - 1;
  return `${railColor(t)} ${((i / 14) * 100).toFixed(1)}%`;
}).join(", ")})`;



const fill: CSSProperties = { position: "absolute", inset: 0 };
const preserve: CSSProperties = { transformStyle: "preserve-3d" };
const hidden: CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

interface Iphone3DProps {
  /** 0 → tela apagada · 1 → tela acesa. */
  screenOn: MotionValue<number>;
  /** Posição do reflexo de luz (varia com a rotação). */
  sheen: MotionValue<string>;
  /** Intensidade (0–1) do reflexo nas laterais; máxima quando o aparelho está de perfil. */
  rim: MotionValue<number>;
  /** "low" reduz a quantidade de camadas em dispositivos móveis. */
  detail?: "high" | "low";
}

export function Iphone3D({ screenOn, sheen, rim, detail = "high" }: Iphone3DProps) {
  const slices = detail === "high" ? 34 : 16;
  const spill = useTransform(screenOn, [0, 1], [0, 0.85]);
  const contentScale = useTransform(screenOn, [0, 1], [1.08, 1]);
  const contentBlur = useTransform(screenOn, [0, 0.6, 1], ["blur(6px)", "blur(1.5px)", "blur(0px)"]);
  const screenBloom = useTransform(screenOn, [0, 0.35, 1], [0, 0.55, 0]);

  return (
    <div style={{ ...preserve, position: "relative", width: W, height: H }}>
      {/* ---- Corpo: fatias arredondadas -------------------------------- */}
      {Array.from({ length: slices }, (_, i) => {
        const t = (i / (slices - 1)) * 2 - 1;
        const z = t * (T / 2 - 1);
        return (
          <div
            key={i}
            style={{
              ...fill,
              borderRadius: R,
              background: railColor(t),
              transform: `translateZ(${z}px)`,
            }}
          />
        );
      })}

      {/* ---- Laterais planas ------------------------------------------- */}
      {(
        [
          { side: "left", x: -W / 2 },
          { side: "right", x: W / 2 },
        ] as const
      ).map(({ side, x }) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: "50%",
            top: R - 2,
            width: T,
            height: H - 2 * R + 4,
            marginLeft: -T / 2,
            background: `${antennaV}, ${brushed}, ${railGradient}`,
            transform: `translateX(${x}px) rotateY(90deg)`,
          }}
        >
          {/* reflexo do ambiente deslizando pela lateral conforme o giro */}
          <motion.div
            style={{
              ...fill,
              opacity: rim,
              mixBlendMode: "screen",
              background:
                "linear-gradient(180deg, transparent 4%, rgba(170,200,255,.75) 24%, rgba(255,255,255,.35) 30%, transparent 46%, transparent 62%, rgba(120,170,255,.5) 80%, transparent 96%)",
            }}
          />
        </div>
      ))}
      {(
        [
          { side: "top", y: -H / 2 },
          { side: "bottom", y: H / 2 },
        ] as const
      ).map(({ side, y }) => (
        <div
          key={side}
          style={{
            position: "absolute",
            top: "50%",
            left: R - 2,
            width: W - 2 * R + 4,
            height: T,
            marginTop: -T / 2,
            background: `${antennaH}, ${railGradient.replace("90deg", "180deg")}`,
            transform: `translateY(${y}px) rotateX(90deg)`,
          }}
        />
      ))}

      {/* ---- Botões laterais ------------------------------------------- */}
      {[
        { x: -W / 2, y: 132, h: 30 }, // botão de ação
        { x: -W / 2, y: 186, h: 54 }, // volume +
        { x: -W / 2, y: 252, h: 54 }, // volume -
        { x: W / 2, y: 214, h: 88 }, // botão lateral
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: b.y,
            width: T * 0.42,
            height: b.h,
            marginLeft: -(T * 0.42) / 2,
            borderRadius: 3,
            background: railGradient,
            transform: `translateX(${b.x + Math.sign(b.x) * 1.5}px) rotateY(90deg)`,
          }}
        />
      ))}

      {/* ---- FRENTE ----------------------------------------------------- */}
      <div
        style={{
          ...fill,
          ...hidden,
          borderRadius: R,
          background: "#04050a",
          boxShadow:
            "inset 0 0 0 1.5px hsl(222 40% 62% / .55), inset 0 0 0 4px hsl(222 26% 10%)",
          transform: `translateZ(${T / 2}px)`,
        }}
      >
        {/* luz da tela vazando sobre a moldura e o chassi */}
        <motion.div
          style={{
            ...fill,
            borderRadius: R,
            opacity: spill,
            boxShadow: "inset 0 0 0 1.5px rgba(120,165,255,.75), inset 0 0 30px rgba(40,100,255,.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: R - 7,
            overflow: "hidden",
            background: "#000",
            isolation: "isolate",
          }}
        >
          {/* conteúdo da tela (acende com o scroll) */}
          <motion.div
            style={{
              ...fill,
              opacity: screenOn,
              scale: contentScale,
              filter: contentBlur,
            }}
          >
            <ScreenWallpaper />
          </motion.div>

          {/* bloom de "boot" */}
          <motion.div
            style={{
              ...fill,
              opacity: screenBloom,
              background:
                "radial-gradient(70% 50% at 50% 55%, rgba(120,165,255,.55), rgba(0,77,208,.15) 60%, transparent 80%)",
            }}
          />

          {/* vidro: reflexo fixo + reflexo dinâmico */}
          <div
            style={{
              ...fill,
              background:
                "linear-gradient(155deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,0) 32%)",
            }}
          />
          <motion.div
            style={{
              ...fill,
              backgroundImage:
                "linear-gradient(112deg, transparent 32%, rgba(140,180,255,.26) 47%, rgba(255,255,255,.1) 52%, transparent 64%)",
              backgroundSize: "260% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: sheen,
              mixBlendMode: "screen",
            }}
          />

          {/* vinheta de borda do vidro */}
          <div
            style={{
              ...fill,
              borderRadius: R - 7,
              boxShadow: "inset 0 0 22px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.06)",
            }}
          />

          {/* ilha de sensores */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              width: 92,
              height: 27,
              marginLeft: -46,
              borderRadius: 14,
              background: "#000",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 9,
                top: 8,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #4a63c9 0, #16214f 28%, #05060d 62%)",
                boxShadow: "0 0 0 2px #0a0b12, 0 0 0 3px rgba(120,150,255,.12)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ---- TRASEIRA --------------------------------------------------- */}
      <IphoneBack sheen={sheen} detail={detail} />
    </div>
  );
}
