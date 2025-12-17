export type StatusPagamento = "PAGO" | "PENDENTE";

export interface AulaCreateRequest {
    alunoId: number;
    data: string; // yyyy-MM-dd
    horaInicio: string; // HH:mm
    horaFim: string; // HH:mm
    tipoAulaId: number;
    valor: number;
    statusPagamento: StatusPagamento;
}

export interface AulaResponse {
    id: number;
    alunoId: number;
    nomeAluno: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    tipoAulaId: number;
    nomeTipoAula: string;
    valor: number;
    statusPagamento: StatusPagamento;
}
