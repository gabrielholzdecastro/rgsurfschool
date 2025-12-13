import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { AulaRequest, AulaResponse } from "@/types/aula";

const BASE_PATH = "/api/aula";

export async function getAulas(): Promise<AulaResponse[]> {
  return apiGet<AulaResponse[]>(BASE_PATH);
}

export async function getAula(id: number): Promise<AulaResponse> {
  return apiGet<AulaResponse>(`${BASE_PATH}/${id}`);
}

export async function createAula(data: AulaRequest): Promise<AulaResponse> {
  return apiPost<AulaResponse>(BASE_PATH, data);
}

export async function updateAula(
  id: number,
  data: AulaRequest
): Promise<AulaResponse> {
  return apiPut<AulaResponse>(`${BASE_PATH}/${id}`, data);
}

export async function deleteAula(id: number): Promise<void> {
  return apiDelete(`${BASE_PATH}/${id}`);
}
