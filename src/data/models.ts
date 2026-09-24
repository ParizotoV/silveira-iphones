import type { ModelSpecs } from "./types";

/**
 * Especificações de REFERÊNCIA por modelo (dados públicos de fabricante).
 * São características do modelo — não garantias da unidade à venda.
 * Para adicionar um modelo novo, inclua uma entrada aqui com o mesmo `name`
 * usado em `products.ts`. Modelos sem entrada simplesmente não exibem a tabela.
 */
export const modelSpecs: Record<string, ModelSpecs> = {
  "iPhone 13": {
    chip: "A15 Bionic",
    display: "6,1\" Super Retina XDR (OLED)",
    cameras: "Duas câmeras de 12 MP (principal e ultra-angular)",
    connector: "Lightning",
    highlights: ["5G", "Modo Cinema", "Resistência à água IP68"],
  },
  "iPhone 13 Pro Max": {
    chip: "A15 Bionic",
    display: "6,7\" Super Retina XDR com ProMotion (até 120 Hz)",
    cameras: "Três câmeras de 12 MP (principal, ultra-angular e teleobjetiva 3x)",
    connector: "Lightning",
    highlights: ["5G", "Scanner LiDAR", "Estrutura em aço inoxidável"],
  },
  "iPhone 14": {
    chip: "A15 Bionic",
    display: "6,1\" Super Retina XDR (OLED)",
    cameras: "Duas câmeras de 12 MP (principal e ultra-angular)",
    connector: "Lightning",
    highlights: ["5G", "Detecção de Acidente", "Resistência à água IP68"],
  },
  "iPhone 14 Pro": {
    chip: "A16 Bionic",
    display: "6,1\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Câmera principal de 48 MP, ultra-angular e teleobjetiva 3x",
    connector: "Lightning",
    highlights: ["Dynamic Island", "Tela Sempre Ativa", "Scanner LiDAR"],
  },
  "iPhone 15": {
    chip: "A16 Bionic",
    display: "6,1\" Super Retina XDR (OLED)",
    cameras: "Câmera principal de 48 MP e ultra-angular de 12 MP",
    connector: "USB-C",
    highlights: ["Dynamic Island", "5G", "Resistência à água IP68"],
  },
  "iPhone 15 Pro Max": {
    chip: "A17 Pro",
    display: "6,7\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Principal de 48 MP, ultra-angular e teleobjetiva 5x",
    connector: "USB-C",
    highlights: ["Estrutura em titânio", "Botão de Ação", "Dynamic Island"],
  },
  "iPhone 16": {
    chip: "A18",
    display: "6,1\" Super Retina XDR (OLED)",
    cameras: "Câmera Fusion de 48 MP e ultra-angular de 12 MP",
    connector: "USB-C",
    highlights: ["Botão de Ação", "Controle da Câmera", "Dynamic Island"],
  },
  "iPhone 16 Pro": {
    chip: "A18 Pro",
    display: "6,3\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Fusion de 48 MP, ultra-angular de 48 MP e teleobjetiva 5x",
    connector: "USB-C",
    highlights: ["Estrutura em titânio", "Controle da Câmera", "Botão de Ação"],
  },
  "iPhone 16 Pro Max": {
    chip: "A18 Pro",
    display: "6,9\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Fusion de 48 MP, ultra-angular de 48 MP e teleobjetiva 5x",
    connector: "USB-C",
    highlights: ["Estrutura em titânio", "Controle da Câmera", "Botão de Ação"],
  },
  "iPhone 17": {
    chip: "A19",
    display: "6,3\" Super Retina XDR com ProMotion",
    cameras: "Sistema de dupla câmera de 48 MP",
    connector: "USB-C",
    highlights: ["Dynamic Island", "Botão de Ação", "Controle da Câmera"],
  },
  "iPhone 17 Pro": {
    chip: "A19 Pro",
    display: "6,3\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Sistema Pro de três câmeras de 48 MP",
    connector: "USB-C",
    highlights: ["Estrutura unibody em alumínio", "Controle da Câmera", "Botão de Ação"],
  },
  "iPhone 17 Pro Max": {
    chip: "A19 Pro",
    display: "6,9\" Super Retina XDR com ProMotion e tela Sempre Ativa",
    cameras: "Sistema Pro de três câmeras de 48 MP",
    connector: "USB-C",
    highlights: ["Estrutura unibody em alumínio", "Controle da Câmera", "Botão de Ação"],
  },
};
