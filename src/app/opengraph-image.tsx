import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 80% 90%, rgba(0,77,208,0.75), rgba(1,1,3,0) 60%), #010103",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, color: "#4d86f0" }}>SILVEIRA IPHONES</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 900 }}>
            Seu próximo iPhone começa aqui.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#a1a1aa" }}>
            Tecnologia, exclusividade e atendimento especializado.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
