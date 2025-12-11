import { Condicao } from "./loja";

export interface EquipamentoRequest {
  nome: string;
  qtdEstoque: number;
  condicao: Condicao;
  preco: number;
  custo: number;
  dataAquisicao: string; // ISO date
  fornecedor: string;
  emUso: boolean;
  disponivelVenda: boolean;
}

export interface EquipamentoResponse extends EquipamentoRequest {
  id: number;
}
