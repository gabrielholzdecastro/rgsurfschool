export interface TipoAula {
    id: number;
    nome: string;
    valorPadrao: number;
}

export interface TipoAulaCreateRequest {
    nome: string;
    valorPadrao: number;
}

export interface TipoAulaResponse {
    id: number;
    nome: string;
    valorPadrao: number;
}

export interface TipoAulaUpdateRequest {
    nome?: string;
    valorPadrao?: number;
}

