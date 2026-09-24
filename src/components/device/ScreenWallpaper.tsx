import { useId, useSyncExternalStore } from "react";

/* Relógio da tela: hora local do visitante (fuso do navegador), atualizada a cada minuto. */
const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function subscribeClock(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    onChange();
    // alinha o próximo tique à virada do minuto
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  };
  timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
  return () => clearTimeout(timer);
}

function useLocalTime() {
  return useSyncExternalStore(
    subscribeClock,
    () => timeFormat.format(new Date()),
    () => "10:09", // renderização no servidor (a tela ainda está apagada)
  );
}

/**
 * Wallpaper abstrato original (preto profundo + azul elétrico) exibido na tela
 * do aparelho da experiência 3D. Não usa a interface nem os wallpapers da Apple.
 */
export function ScreenWallpaper() {
  const uid = useId().replace(/:/g, "");
  const time = useLocalTime();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#010103]">
      <svg
        viewBox="0 0 260 566"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden
        focusable="false"
      >
        <defs>
          <radialGradient id={`${uid}-a`} cx="0.5" cy="0.95" r="0.8">
            <stop offset="0" stopColor="#3b7bff" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#004dd0" stopOpacity="0.7" />
            <stop offset="1" stopColor="#010103" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-b`} cx="0.05" cy="0.2" r="0.7">
            <stop offset="0" stopColor="#004dd0" stopOpacity="0.5" />
            <stop offset="1" stopColor="#010103" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-ribbon1`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7fa8ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7fa8ff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#004dd0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-ribbon2`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4d86f0" stopOpacity="0" />
            <stop offset="0.5" stopColor="#4d86f0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#004dd0" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="260" height="566" fill="#010103" />
        <rect width="260" height="566" fill={`url(#${uid}-b)`} />
        <rect width="260" height="566" fill={`url(#${uid}-a)`} />

        {/* fitas de luz */}
        <g fill="none" strokeLinecap="round">
          <path d="M-20 470 C 60 330, 150 420, 290 240" stroke={`url(#${uid}-ribbon1)`} strokeWidth="2.2" />
          <path d="M-20 490 C 70 360, 160 450, 290 270" stroke={`url(#${uid}-ribbon1)`} strokeWidth="1.2" opacity="0.7" />
          <path d="M-20 510 C 80 390, 170 470, 290 300" stroke={`url(#${uid}-ribbon2)`} strokeWidth="1" />
          <path d="M-30 430 C 50 300, 140 380, 290 200" stroke={`url(#${uid}-ribbon2)`} strokeWidth="0.8" opacity="0.6" />
        </g>
      </svg>

      {/* tela de bloqueio — relógio e assinatura da marca */}
      <div className="absolute inset-x-0 top-[17%] text-center text-white">
        <p className="font-display text-[3.4rem] leading-none font-semibold tracking-[-0.04em]" suppressHydrationWarning>
          {time}
        </p>
        <p className="mt-2 font-mono text-[0.55rem] tracking-[0.32em] text-white/70 uppercase">
          Silveira iPhones
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-3 mx-auto h-1 w-[34%] rounded-full bg-white/60" />
    </div>
  );
}
