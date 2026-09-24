"use client";

import { motion, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { PHONE } from "./phone-constants";

const { T, R } = PHONE;

const fill: CSSProperties = { position: "absolute", inset: 0 };
const preserve: CSSProperties = { transformStyle: "preserve-3d" };
const hidden: CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

const noise = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/**
 * Traseira do aparelho: alumínio azul-profundo com painel de vidro fosco,
 * barra de câmeras com espessura real (camadas em Z) e lentes com revestimento.
 */
export function IphoneBack({ sheen, detail = "high" }: { sheen: MotionValue<string>; detail?: "high" | "low" }) {
  // Altura do bloco de câmeras (px em Z). O corpo todo tem 30 px de espessura.
  const PLATEAU = 10;
  const layers = detail === "high" ? 24 : 12;
  return (
    <div
      style={{
        ...fill,
        ...hidden,
        ...preserve,
        borderRadius: R,
        background: "linear-gradient(155deg, #4a6396 0%, #2c3c62 26%, #18203a 62%, #0d1224 100%)",
        boxShadow:
          "inset 0 0 0 1.5px hsl(219 50% 72% / .55), inset 0 2px 0 rgba(225,238,255,.35), inset 0 0 70px rgba(0,0,0,.5)",
        transform: `translateZ(${-T / 2}px) rotateY(180deg)`,
      }}
    >
      {/* textura fosca do alumínio */}
      <div style={{ ...fill, borderRadius: R, backgroundImage: noise, opacity: 0.2, mixBlendMode: "overlay" }} />

      {/* painel de vidro fosco (parte inferior) */}
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          top: 10,
          borderRadius: 44,
          background:
            "linear-gradient(165deg, rgba(150,180,245,.30) 0%, rgba(80,110,190,.14) 55%, rgba(10,16,40,.28) 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(200,220,255,.2), inset 0 1.5px 0 rgba(235,244,255,.38), inset 0 -30px 50px rgba(0,0,0,.22)",
        }}
      >
        <div style={{ ...fill, borderRadius: 44, backgroundImage: noise, opacity: 0.12, mixBlendMode: "soft-light" }} />
        {/* monograma gravado */}
        <svg
          viewBox="0 0 24 24"
          style={{ position: "absolute", left: "50%", top: "65%", width: 58, height: 58, marginLeft: -29, marginTop: -29 }}
          fill="none"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden
        >
          <path
            d="M16.5 7.2C15.6 5.9 14 5 12 5c-2.4 0-4 1.2-4 3 0 4.2 8.2 2.2 8.2 7 0 2-1.9 3.4-4.4 3.4-2.2 0-3.9-.9-4.9-2.4"
            stroke="rgba(220,235,255,.5)"
            style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,.35))" }}
          />
        </svg>
      </div>

      {/* reflexo dinâmico (duas faixas) */}
      <motion.div
        style={{
          ...fill,
          borderRadius: R,
          backgroundImage:
            "linear-gradient(118deg, transparent 28%, rgba(110,165,255,.34) 44%, rgba(255,255,255,.16) 50%, transparent 60%), linear-gradient(118deg, transparent 66%, rgba(140,180,255,.14) 74%, transparent 82%)",
          backgroundSize: "260% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: sheen,
          mixBlendMode: "screen",
        }}
      />

      {/* bloco de câmeras: camadas a cada ~1 px em Z formam a parede sólida */}
      {Array.from({ length: layers }, (_, i) => {
        const t = i / (layers - 1);
        const z = 1 + t * (PLATEAU - 1);
        const top = i === layers - 1;
        const base: CSSProperties = {
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          height: 166,
          borderRadius: 44,
          transform: `translateZ(${z}px)`,
        };

        // parede lateral: metal que clareia em direção ao topo (legível de perfil)
        if (!top) {
          return (
            <div
              key={i}
              style={{
                ...base,
                background: `hsl(219 42% ${(20 + 44 * t ** 2.2).toFixed(1)}%)`,
                boxShadow:
                  i === 0
                    ? "0 8px 14px rgba(0,0,0,.5), 0 2px 4px rgba(0,0,0,.6)"
                    : i === layers - 2
                      ? "inset 0 0 0 1px rgba(215,230,255,.55)"
                      : "none",
              }}
            />
          );
        }

        // topo: chanfro (luz vinda de cima-esquerda) + face plana com reflexo dinâmico
        return (
          <div
            key={i}
            style={{
              ...base,
              background: "linear-gradient(135deg, #eaf2ff 0%, #93acdf 14%, #4b638f 46%, #17203c 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,.4)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 5,
                borderRadius: 39,
                overflow: "hidden",
                background: "linear-gradient(160deg, #6a86bf 0%, #3d5079 45%, #212c4e 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(8,12,30,.75), inset 0 2px 3px rgba(255,255,255,.28), inset 0 -4px 10px rgba(0,0,0,.4)",
              }}
            >
              <div style={{ ...fill, backgroundImage: noise, opacity: 0.1, mixBlendMode: "overlay" }} />
              <motion.div
                style={{
                  ...fill,
                  backgroundImage:
                    "linear-gradient(118deg, transparent 28%, rgba(150,190,255,.4) 44%, rgba(255,255,255,.28) 50%, transparent 60%)",
                  backgroundSize: "260% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionX: sheen,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* paredes planas do bloco: fecham as frestas quando visto de perfil */}
      {[
        // esquerda / direita (trechos retos)
        { x: 10, y: 10 + 42, w: PLATEAU, h: 166 - 84, rot: "rotateY(90deg)", dir: "90deg", cx: true },
        { x: 270, y: 10 + 42, w: PLATEAU, h: 166 - 84, rot: "rotateY(90deg)", dir: "90deg", cx: true },
        // topo / base
        { x: 10 + 42, y: 10, w: 260 - 84, h: PLATEAU, rot: "rotateX(90deg)", dir: "180deg", cx: false },
        { x: 10 + 42, y: 176, w: 260 - 84, h: PLATEAU, rot: "rotateX(90deg)", dir: "180deg", cx: false },
      ].map((wall, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: wall.cx ? wall.x - wall.w / 2 : wall.x,
            top: wall.cx ? wall.y : wall.y - wall.h / 2,
            width: wall.w,
            height: wall.h,
            background: `linear-gradient(${wall.dir}, ${
              wall.cx
                ? "hsl(219 42% 66%), hsl(219 42% 38%) 32%, hsl(219 40% 18%)"
                : "hsl(219 40% 18%), hsl(219 42% 38%) 68%, hsl(219 42% 66%)"
            })`,
            transform: `translateZ(${PLATEAU / 2}px) ${wall.rot}`,
          }}
        />
      ))}

      <div
        style={{
          ...preserve,
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          height: 166,
          transform: `translateZ(${PLATEAU}px)`,
        }}
      >
        <Lens x={20} y={14} />
        <Lens x={20} y={90} />
        <Lens x={100} y={52} />
        {/* flash */}
        <span
          style={{
            position: "absolute",
            left: 194,
            top: 20,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #ffffff, #e9e1c8 45%, #8a8367 100%)",
            boxShadow: "0 0 0 3px #10162b, 0 0 0 4.5px rgba(190,210,255,.35), inset 0 -2px 4px rgba(0,0,0,.25)",
          }}
        />
        {/* microfone */}
        <span
          style={{
            position: "absolute",
            left: 206,
            top: 76,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#05060c",
            boxShadow: "0 0 0 1.5px rgba(190,210,255,.25)",
          }}
        />
        {/* LiDAR */}
        <span
          style={{
            position: "absolute",
            left: 194,
            top: 108,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #232c52, #05060c 65%)",
            boxShadow: "0 0 0 3px #10162b, 0 0 0 4.5px rgba(190,210,255,.28)",
          }}
        />
      </div>
    </div>
  );
}

/** Lente: aro metálico que sai do bloco (camadas em Z), vidro com revestimento em anéis e reflexos. */
function Lens({ x, y, height = 9 }: { x: number; y: number; height?: number }) {
  const size = 66;
  const ring =
    "conic-gradient(from 210deg, #dbe6ff, #56658f 14%, #1a2036 30%, #aab9e0 50%, #1a2036 68%, #56658f 86%, #dbe6ff)";

  return (
    <div style={{ ...preserve, position: "absolute", left: x, top: y, width: size, height: size }}>
      {/* sombra do aro sobre o bloco */}
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          boxShadow: "0 0 0 3px rgba(3,6,18,.92), 4px 9px 14px rgba(0,0,0,.75)",
          transform: "translateZ(0.5px)",
        }}
      />
      {/* parede cilíndrica do aro */}
      {Array.from({ length: height }, (_, k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `hsl(219 30% ${(24 + 40 * (k / height) ** 2).toFixed(1)}%)`,
            transform: `translateZ(${k + 1}px)`,
          }}
        />
      ))}

      {/* topo do aro + vidro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: ring,
          boxShadow: "0 0 0 1.5px #0a0e1e, inset 0 0 0 1px rgba(255,255,255,.3)",
          transform: `translateZ(${height + 1}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: "50%",
            background: "#04050a",
            boxShadow: "inset 0 3px 6px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.1)",
          }}
        >
          {/* revestimento anti-reflexo em anéis */}
          <div
            style={{
              position: "absolute",
              inset: 3,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #000 0 20%, #0b1236 24% 30%, #2a1f6b 33% 37%, #05060d 40% 55%, #0f1d55 58% 64%, #02030a 68% 100%)",
            }}
          />
          {/* reflexo cônico */}
          <div
            style={{
              position: "absolute",
              inset: 3,
              borderRadius: "50%",
              background:
                "conic-gradient(from 20deg, transparent 0 18%, rgba(130,170,255,.42) 24%, transparent 32% 66%, rgba(200,150,255,.3) 74%, transparent 82%)",
              mixBlendMode: "screen",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "24%",
              top: "18%",
              width: "26%",
              height: "14%",
              borderRadius: "50%",
              background: "rgba(200,220,255,.7)",
              filter: "blur(1.5px)",
              transform: "rotate(-35deg)",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "22%",
              bottom: "20%",
              width: "9%",
              height: "9%",
              borderRadius: "50%",
              background: "rgba(150,190,255,.6)",
              filter: "blur(1px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
