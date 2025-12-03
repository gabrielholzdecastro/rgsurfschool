import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { LojaRequest, LojaResponse } from "@/types/loja";

export async function getLojas(): Promise<LojaResponse[]> {
  return apiGet<LojaResponse[]>("/api/loja");
}

export async function createLoja(data: LojaRequest): Promise<LojaResponse> {
  return apiPost<LojaResponse>("/api/loja", data);
}

export async function updateLoja(
  id: number,
  data: LojaRequest
): Promise<LojaResponse> {
  return apiPut<LojaResponse>(`/api/loja/${id}`, data);
}

export async function deleteLoja(id: number): Promise<void> {
  return apiDelete(`/api/loja/${id}`);
}

