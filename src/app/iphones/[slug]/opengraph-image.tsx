import { ImageResponse } from "next/og";
import { getProductBySlug, getProducts } from "@/data/repository";
import { formatPrice } from "@/lib/format";
import { colorHex } from "@/lib/colors";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "iPhone à venda na Silveira iPhones";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

/** Imagem de compartilhamento (WhatsApp, redes) para cada aparelho. */
export default async function ProductOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name ?? "iPhone";
  const meta = product ? `${product.storage} · ${product.color} · ${product.condition}` : "";
  const price = product ? formatPrice(product.price) : null;
  const tint = product ? colorHex(product.color) : "#4a4b50";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 78% 55%, rgba(0,77,208,0.7), rgba(1,1,3,0) 60%), #010103",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 9, color: "#4d86f0" }}>SILVEIRA IPHONES</div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
            {name}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#a1a1aa" }}>{meta}</div>
          <div style={{ display: "flex", marginTop: 40, fontSize: price ? 54 : 32, fontWeight: 600, color: price ? "#fff" : "#d4d4d8" }}>
            {price ?? "Consulte disponibilidade"}
          </div>
        </div>

        {/* silhueta ilustrativa do aparelho */}
        <div
          style={{
            display: "flex",
            width: 250,
            height: 510,
            borderRadius: 58,
            border: "3px solid rgba(160,190,255,0.6)",
            background: `linear-gradient(150deg, ${tint}, #0b0d16)`,
            boxShadow: "0 0 120px rgba(0,77,208,0.7)",
          }}
        />
      </div>
    ),
    size,
  );
}
