# Silveira iPhones

Vitrine digital premium de iPhones. A conversão acontece pelo **WhatsApp** — não há carrinho, checkout, login nem banco de dados.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide.

## Rodando

```bash
npm install
cp .env.example .env.local   # ajuste o número de WhatsApp
npm run dev                  # http://localhost:3000
```

Verificações: `npm run lint` · `npx tsc --noEmit` · `npm run build`.

**Testar no celular (mesma rede Wi-Fi):** abra `http://<IP-do-PC>:3000`. As origens de rede local já estão liberadas em `next.config.ts` (`allowedDevOrigins`); sem isso o Next bloqueia os scripts e a animação não funciona. Reinicie o `npm run dev` após alterar esse arquivo.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número da loja, **só dígitos com DDI+DDD** (ex.: `5511999999999`). Vazio → o link abre o WhatsApp com a mensagem pronta e o visitante escolhe o contato. |
| `NEXT_PUBLIC_SITE_URL` | URL pública, sem barra final. Usada em metadados, sitemap, robots e Open Graph. |

Ambas são lidas em build time (`NEXT_PUBLIC_*`): reinicie/rebuild após alterar.

## Estrutura

```
src/
  app/            rotas: /, /iphones, /iphones/[slug], /sobre, /contato, sitemap, robots, OG images
  components/
    hero/         HeroExperience — experiência 3D controlada pelo scroll
    device/       Iphone3D (CSS 3D) e ScreenWallpaper
    catalog/      Catalog (busca, filtros, ordenação) e ProductCard
    product/      Gallery
    home/         seções da home, LeadForm
    layout/       Header, Footer, WhatsAppFloat, Providers
    ui/           Button, WhatsAppButton, Reveal, PhoneArt, ProductImage...
  data/           types.ts · products.ts · models.ts · repository.ts
  lib/            whatsapp.ts (links centralizados) · format · site · hooks
```

## Documentação

- [Cadastro de produtos](docs/PRODUTOS.md)
- [Experiência 3D do hero e como trocar por um modelo GLB](docs/EXPERIENCIA-3D.md)

## Tokens visuais

Definidos em `src/app/globals.css`: preto `#010103`, azul elétrico `#004DD0` (`--electric-soft #4D86F0` para texto sobre fundo escuro, por contraste), superfície `#0B0B10`, borda `#242430`, cinza `#A1A1AA`. Fontes: Sora (títulos), Geist (texto), Geist Mono (detalhes técnicos).
