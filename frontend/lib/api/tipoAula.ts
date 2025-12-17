import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { TipoAulaCreateRequest, TipoAulaResponse, TipoAulaUpdateRequest } from "@/types/tipoAula";

export async function getTipoAulas(): Promise<TipoAulaResponse[]> {
    return apiGet<TipoAulaResponse[]>("/api/tipo-aula");
}

export async function getTipoAula(id: number): Promise<TipoAulaResponse> {
    return apiGet<TipoAulaResponse>(`/api/tipo-aula/${id}`);
}

export async function createTipoAula(data: TipoAulaCreateRequest): Promise<TipoAulaResponse> {
    return apiPost<TipoAulaResponse>("/api/tipo-aula", data);
}

export async function updateTipoAula(id: number, data: TipoAulaUpdateRequest): Promise<TipoAulaResponse> {
    return apiPut<TipoAulaResponse>(`/api/tipo-aula/${id}`, data);
}

export async function deleteTipoAula(id: number): Promise<void> {
    return apiDelete(`/api/tipo-aula/${id}`);
}

