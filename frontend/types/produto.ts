export enum Condicao {
  EXCELENTE = "EXCELENTE",
  BOM = "BOM",
}

export interface ProdutoRequest {
  nome: string;
  qtdEstoque: number;
  condicao: Condicao;
  preco: number;
  custo: number;
  dataAquisicao: string; // ISO date string
  fornecedor: string;
}

export interface ProdutoResponse {
  id: number;
  nome: string;
  qtdEstoque: number;
  condicao: Condicao;
  preco: number;
  custo: number;
  dataAquisicao: string; // ISO date string
  fornecedor: string;
}

