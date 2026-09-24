# Cadastro de produtos

Não há banco de dados: os aparelhos ficam em [`src/data/products.ts`](../src/data/products.ts). Componentes e páginas só leem dados por [`src/data/repository.ts`](../src/data/repository.ts) — para migrar para banco/CMS, troque o corpo dessas funções (já são `async`) mantendo o tipo `Product`.

> ⚠️ Os itens atuais são **dados de demonstração**. Ao cadastrar os reais, apague os fictícios e mude `isDemoCatalog` para `false` em `products.ts` (remove os avisos de demonstração do site).

## Campos

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | string | sim | Estável e único (ex.: `iphone-013`). Vai na mensagem de WhatsApp. |
| `slug` | string | sim | URL: `/iphones/<slug>`. Minúsculas, sem acento, hífens. Único (checado em dev). |
| `name` | string | sim | Modelo, ex.: `iPhone 16 Pro Max`. Se existir em `models.ts`, a ficha técnica aparece. |
| `generation` | string | sim | Filtro por geração, ex.: `iPhone 16`. |
| `storage` | string | sim | `128 GB`, `256 GB`, `1 TB`… |
| `color` | string | sim | Nome da cor. Cores conhecidas (`lib/colors.ts`) tingem o placeholder. |
| `condition` | `"Novo"`, `"Seminovo"` ou `"Usado"` | sim | |
| `batteryHealth` | number (0–100) | não | **Só informe se conferida na unidade.** Sem o campo, nada é exibido. |
| `price` | number ou null | sim | Em reais. `null` → “Consulte o valor”. |
| `images` | string[] | sim | Caminhos a partir de `/public`. `[]` → ilustração marcada “Imagem ilustrativa”. |
| `featured` | boolean | sim | Aparece na home e no filtro “Somente destaques”. |
| `available` | boolean | sim | `false` → selo “Indisponível no momento”. |
| `notes` | string | não | Observação curta da unidade. |
| `unitInfo` | `{label, value}[]` | não | Informações comerciais **confirmadas** (garantia, nota fiscal, acessórios). Sem elas, o site orienta a confirmar no atendimento — nada é prometido. |

## Exemplo

```ts
{
  id: "iphone-013",
  slug: "iphone-16-pro-max-256gb-preto",
  name: "iPhone 16 Pro Max",
  generation: "iPhone 16",
  storage: "256 GB",
  color: "Titânio Preto",
  condition: "Seminovo",
  batteryHealth: 99,
  price: 5650,
  images: ["/products/iphone-16-pro-max-256-preto-1.webp", "/products/iphone-16-pro-max-256-preto-2.webp"],
  featured: true,
  available: true,
  unitInfo: [{ label: "Garantia", value: "…texto confirmado pela loja…" }],
}
```

## Imagens

Coloque em `public/products/` (recomendado: WebP, proporção ~4:5, ≥ 1200 px de altura, um arquivo por ângulo). Veja [`public/products/README.md`](../public/products/README.md). Use somente fotos do aparelho correto.

## Especificações por modelo

Em [`src/data/models.ts`](../src/data/models.ts) (chip, tela, câmeras, conector, destaques), indexadas pelo `name`. São dados de referência do modelo, não da unidade; **revise antes de publicar**.

## WhatsApp

Toda mensagem é gerada em [`src/lib/whatsapp.ts`](../src/lib/whatsapp.ts). A de produto inclui modelo, capacidade, cor, condição e `id`.
