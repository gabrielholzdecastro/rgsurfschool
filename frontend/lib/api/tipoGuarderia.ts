import { apiGet, apiPut } from "./client";
import type { TipoGuarderiaResponse, TipoGuarderiaUpdateRequest } from "@/types/tipoGuarderia";

export async function getTipoGuarderias(): Promise<TipoGuarderiaResponse[]> {
    return apiGet<TipoGuarderiaResponse[]>("/api/tipo-guarderia");
}

export async function getTipoGuarderia(id: number): Promise<TipoGuarderiaResponse> {
    return apiGet<TipoGuarderiaResponse>(`/api/tipo-guarderia/${id}`);
}

export async function updateTipoGuarderia(id: number, data: TipoGuarderiaUpdateRequest): Promise<TipoGuarderiaResponse> {
    return apiPut<TipoGuarderiaResponse>(`/api/tipo-guarderia/${id}`, data);
}

