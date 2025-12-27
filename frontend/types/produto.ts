export interface ProdutoRequest {
  nome: string;
  qtdEstoque: number;
  preco: number;
  custo?: number;
  dataAquisicao?: string; // ISO date string
  fornecedor?: string;
}

export interface ProdutoResponse {
  id: number;
  nome: string;
  qtdEstoque: number;
  preco: number;
  custo?: number;
  dataAquisicao?: string; // ISO date string
  fornecedor?: string;
}

