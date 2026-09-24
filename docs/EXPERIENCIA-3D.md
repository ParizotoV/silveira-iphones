# Experiência 3D do hero

## O que foi implementado

`src/components/hero/HeroExperience.tsx` + `src/components/device/Iphone3D.tsx`.

**Não existe** um modelo GLB/GLTF de iPhone no projeto e nenhum foi inventado. Em vez de um objeto genérico ou de um PNG girando, o aparelho é **construído em CSS 3D** (sem WebGL e sem arquivos externos):

- corpo extrudado em camadas arredondadas + laterais planas com chanfros (sem “frestas” de perfil);
- traseira fosca com módulo de três câmeras em **relevo real** (eixo Z), flash e LiDAR;
- frente com vidro, ilha de sensores e tela com wallpaper abstrato próprio (azul/preto — não usa interface nem wallpapers da Apple);
- reflexos dinâmicos que acompanham a rotação, halo azul, anel técnico e sombra no “chão”.

Vantagens: zero peso de download, funciona em qualquer navegador e é leve em celulares. O aparelho é uma representação estilizada, não uma réplica fotorrealista.

## Linha do tempo (progresso do scroll na seção pinada)

| Progresso | Estado |
|---|---|
| 0% | Aparelho flutuando (traseira), “SILVEIRA IPHONES / Seu próximo iPhone começa aqui.” |
| 20% | Início da rotação 3D, luz azul acompanhando as bordas |
| 40% | Gira para revelar a frente, tela apagada |
| 45–62% | Tela acende gradualmente (preto → brilho → interface) |
| 60% | Aproximação (profundidade) |
| 80% | Aparelho desloca para a direita; texto e botões entram |
| 90–100% | Composição final equilibrada; a vitrine surge logo abaixo |

Os marcos ficam nos arrays no topo de `HeroExperience.tsx` (`P`, `ROTATE_*`, `D_*` desktop, `M_*` mobile). O progresso passa por uma mola (`useSpring`): rolar para cima retorna suavemente aos estados anteriores.

## Mobile e acessibilidade

- Abaixo de 1024 px: layout empilhado (aparelho no topo, texto embaixo), menos camadas 3D e sem partículas.
- `prefers-reduced-motion`: a animação continua **controlada pelo scroll** (sem mola), mas os movimentos automáticos (flutuação, brilho, anel) são desligados. O Android ativa essa preferência sozinho em economia de bateria / “remover animações”.
- Os botões do hero só recebem foco/clique quando visíveis.

## Como trocar por um modelo GLB real (opcional)

Forneça um modelo com licença de uso comercial:

- **Arquivo:** `public/models/iphone.glb` (glTF binário, Draco/Meshopt, ideal < 3 MB, texturas ≤ 2K)
- Escala em metros, origem no centro, frente voltada para +Z
- Malha da **tela separada** (material próprio) para animar o acendimento
- Materiais PBR (metal do chassi, vidro traseiro, lentes)

Depois: instalar `three @react-three/fiber @react-three/drei`, criar `IphoneGL.tsx` com `useGLTF` lendo o mesmo `MotionValue` de progresso, carregar com `next/dynamic` (`ssr: false`) só em desktop com WebGL, mantendo `Iphone3D` (CSS) como fallback.
