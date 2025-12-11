export enum Condicao {
  EXCELENTE = "EXCELENTE",
  BOM = "BOM",
  SEMINOVO = "SEMINOVO",
}

export interface LojaRequest {
  nome: string;
  qtdEstoque: number;
  condicao: Condicao;
  preco: number;
  custo: number;
  dataAquisicao: string; // ISO date string
  fornecedor: string;
}

export interface LojaResponse {
  id: number;
  nome: string;
  qtdEstoque: number;
  condicao: Condicao;
  preco: number;
  custo: number;
  dataAquisicao: string; // ISO date string
  fornecedor: string;
}
