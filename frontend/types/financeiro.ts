import { AulaResponse } from "./aula";
import { VendaResponse } from "./venda";
import { GuarderiaResponse } from "./guarderia";

export type TipoTransacao = "AULA" | "VENDA" | "GUARDERIA";
export type StatusPagamentoUnificado = "PAGO" | "PENDENTE";

export interface TransacaoFinanceira {
  id: number;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  data: string;
  statusPagamento: StatusPagamentoUnificado;
  dadosOriginais: AulaResponse | VendaResponse | GuarderiaResponse;
}

export interface ResumoFinanceiro {
  totalRecebido: number;
  totalPendente: number;
  totalGeral: number;
  quantidadePagos: number;
  quantidadePendentes: number;
  quantidadeTotal: number;
}

