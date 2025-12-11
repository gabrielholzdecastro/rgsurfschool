export enum MetodoPagamento {
    PIX = "PIX",
    DINHEIRO = "DINHEIRO",
    CARTAO_CREDITO = "CARTAO_CREDITO",
    CARTAO_DEBITO = "CARTAO_DEBITO"
}

export enum StatusPagamento {
    PAGO = "PAGO",
    PENDENTE = "PENDENTE"
}

export enum TipoItemVenda {
    LOJA = "LOJA",
    EQUIPAMENTO = "EQUIPAMENTO",
    AULA = "AULA",
    TRIP = "TRIP"
}

export interface VendaCreateRequest {
    itemId: number;
    tipoItem: TipoItemVenda;
    alunoId?: number | null;
    nomeComprador?: string;
    quantidade: number;
    metodoPagamento: MetodoPagamento;
    statusPagamento: StatusPagamento;
}

export interface VendaResponse {
    id: number;
    itemId: number | null;
    tipoItem: TipoItemVenda;
    nomeItem: string;
    nomeComprador: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    metodoPagamento: MetodoPagamento;
    statusPagamento: StatusPagamento;
    dataVenda: string;
}
