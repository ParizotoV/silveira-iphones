import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir o servidor de desenvolvimento pelo celular na mesma rede Wi-Fi
  // (ex.: http://192.168.0.10:3000). Sem isso o Next bloqueia os scripts e o
  // site não hidrata (a animação por scroll não funciona). Só afeta `next dev`.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;
