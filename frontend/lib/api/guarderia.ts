import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { GuarderiaCreateRequest, GuarderiaResponse, GuarderiaUpdateRequest } from "@/types/guarderia";

export async function getGuarderias(): Promise<GuarderiaResponse[]> {
    return apiGet<GuarderiaResponse[]>("/api/guarderia");
}

export async function getGuarderia(id: number): Promise<GuarderiaResponse> {
    return apiGet<GuarderiaResponse>(`/api/guarderia/${id}`);
}

export async function createGuarderia(data: GuarderiaCreateRequest): Promise<GuarderiaResponse> {
    return apiPost<GuarderiaResponse>("/api/guarderia", data);
}

export async function updateGuarderia(id: number, data: GuarderiaUpdateRequest): Promise<GuarderiaResponse> {
    return apiPut<GuarderiaResponse>(`/api/guarderia/${id}`, data);
}

export async function deleteGuarderia(id: number): Promise<void> {
    return apiDelete(`/api/guarderia/${id}`);
}

