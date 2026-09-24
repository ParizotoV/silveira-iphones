import { useId } from "react";
import { colorHex, shade } from "@/lib/colors";

export type PhoneView = "back" | "front";
export type CameraLayout = "dual" | "triple";

interface PhoneArtProps {
  color: string;
  view?: PhoneView;
  cameras?: CameraLayout;
  className?: string;
}

/** Modelos "Pro" usam o layout de três câmeras; os demais, duas. */
export function cameraLayoutFor(name: string): CameraLayout {
  return /pro/i.test(name) ? "triple" : "dual";
}

/**
 * Ilustração vetorial de PLACEHOLDER, usada quando o produto ainda não tem
 * fotografia real em /public/products. É deliberadamente uma ilustração
 * (não uma "foto") e a interface sinaliza isso ao visitante.
 */
export function PhoneArt({ color, view = "back", cameras = "triple", className }: PhoneArtProps) {
  const uid = useId().replace(/:/g, "");
  const base = colorHex(color);
  const hi = shade(base, 0.22);
  const lo = shade(base, -0.45);
  const rim = shade(base, 0.38);

  const lenses =
    cameras === "triple"
      ? [
          { x: 47, y: 47 },
          { x: 47, y: 91 },
          { x: 91, y: 69 },
        ]
      : [
          { x: 47, y: 47 },
          { x: 47, y: 91 },
        ];

  return (
    <svg
      viewBox="0 0 220 450"
      className={className}
      role="img"
      aria-label={view === "back" ? "Ilustração da traseira do aparelho" : "Ilustração da frente do aparelho"}
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.55" stopColor={base} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#4d86f0" stopOpacity="0.14" />
        </linearGradient>
        <radialGradient id={`${uid}-lens`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#25366e" />
          <stop offset="0.45" stopColor="#070912" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <linearGradient id={`${uid}-screen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#010103" />
          <stop offset="0.55" stopColor="#031335" />
          <stop offset="1" stopColor="#004dd0" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.75" cy="0.85" r="0.7">
          <stop offset="0" stopColor="#4d86f0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#004dd0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* estrutura */}
      <rect x="8" y="6" width="204" height="438" rx="40" fill={`url(#${uid}-body)`} stroke={rim} strokeOpacity="0.55" strokeWidth="2" />

      {view === "back" ? (
        <>
          <rect x="8" y="6" width="204" height="438" rx="40" fill={`url(#${uid}-sheen)`} />
          {/* plateau */}
          <rect x="20" y="20" width="94" height="94" rx="24" fill={shade(base, -0.18)} stroke={rim} strokeOpacity="0.5" strokeWidth="1.5" />
          {lenses.map((l) => (
            <g key={`${l.x}-${l.y}`}>
              <circle cx={l.x} cy={l.y} r="18" fill="#0b0c12" stroke={rim} strokeOpacity="0.7" strokeWidth="2.5" />
              <circle cx={l.x} cy={l.y} r="13.5" fill={`url(#${uid}-lens)`} />
              <circle cx={l.x - 4} cy={l.y - 5} r="2.6" fill="#8fb0ff" fillOpacity="0.7" />
            </g>
          ))}
          <circle cx="93" cy="38" r="5.5" fill="#f3eee2" fillOpacity="0.9" stroke={rim} strokeOpacity="0.4" />
          {cameras === "triple" && <circle cx="93" cy="98" r="4" fill="#0b0c12" />}
        </>
      ) : (
        <>
          {/* tela */}
          <rect x="16" y="14" width="188" height="422" rx="33" fill="#000" />
          <rect x="21" y="19" width="178" height="412" rx="29" fill={`url(#${uid}-screen)`} />
          <rect x="21" y="19" width="178" height="412" rx="29" fill={`url(#${uid}-glow)`} />
          <rect x="82" y="30" width="56" height="17" rx="8.5" fill="#000" />
          <text x="110" y="120" textAnchor="middle" fontSize="56" fontWeight="600" fill="#fff" fillOpacity="0.92" fontFamily="system-ui, sans-serif">
            10:09
          </text>
          <rect x="88" y="418" width="44" height="4" rx="2" fill="#fff" fillOpacity="0.55" />
          <rect x="21" y="19" width="178" height="412" rx="29" fill={`url(#${uid}-sheen)`} />
        </>
      )}
    </svg>
  );
}
