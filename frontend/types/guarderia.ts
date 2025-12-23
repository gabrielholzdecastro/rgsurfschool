import { TempoGuarderia } from "./tipoGuarderia";

export interface GuarderiaCreateRequest {
    alunoId: number;
    tipoGuarderiaId: number;
    valor: number;
    dataInicio: string; // ISO date string
    pago?: boolean;
}

export interface GuarderiaUpdateRequest {
    alunoId?: number;
    tipoGuarderiaId?: number;
    valor?: number;
    dataInicio?: string; // ISO date string
    pago?: boolean;
}

export interface GuarderiaResponse {
    id: number;
    alunoId: number;
    alunoNome: string;
    tipoGuarderiaId: number;
    tipoGuarderia: TempoGuarderia;
    valor: number;
    dataInicio: string; // ISO date string
    dataFim: string; // ISO date string
    dataVencimento: string; // ISO date string
    pago: boolean;
    dataPagamento: string | null; // ISO date string
}

