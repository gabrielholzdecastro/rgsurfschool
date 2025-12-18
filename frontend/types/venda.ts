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

export interface VendaCreateRequest {
    produtoId: number;
    alunoId?: number | null;
    nomeComprador?: string;
    quantidade: number;
    metodoPagamento: MetodoPagamento;
    statusPagamento: StatusPagamento;
}

export interface VendaResponse {
    id: number;
    produtoId: number;
    nomeProduto: string;
    nomeComprador: string;
    alunoId?: number | null;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    metodoPagamento: MetodoPagamento;
    statusPagamento: StatusPagamento;
    dataVenda: string;
}
