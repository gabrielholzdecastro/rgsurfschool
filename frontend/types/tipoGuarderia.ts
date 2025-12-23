export enum TempoGuarderia {
    DIARIA = "DIARIA",
    MENSAL = "MENSAL",
    TRIMESTRAL = "TRIMESTRAL",
    ANUAL = "ANUAL"
}

export interface TipoGuarderiaResponse {
    id: number;
    tipo: TempoGuarderia;
    valorPadrao: number;
}

export interface TipoGuarderiaUpdateRequest {
    valorPadrao?: number;
}

