import { apiGet, apiPost, apiDelete, apiPut, apiPatch } from "./client";
import type { AulaCreateRequest, AulaResponse } from "@/types/aula";

export async function getAulas(): Promise<AulaResponse[]> {
    return apiGet<AulaResponse[]>("/api/aulas");
}

export async function getAula(id: number): Promise<AulaResponse> {
    return apiGet<AulaResponse>(`/api/aulas/${id}`);
}

export async function createAula(data: AulaCreateRequest): Promise<AulaResponse> {
    return apiPost<AulaResponse>("/api/aulas", data);
}

export async function deleteAula(id: number): Promise<void> {
    return apiDelete(`/api/aulas/${id}`);
}

export async function updateAula(id: number, data: AulaCreateRequest): Promise<AulaResponse> {
    return apiPut<AulaResponse>(`/api/aulas/${id}`, data);
}

export async function quitarAula(id: number): Promise<void> {
    return apiPatch<void>(`/api/aulas/${id}/quitar`);
}
