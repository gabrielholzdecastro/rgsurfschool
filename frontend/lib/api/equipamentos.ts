import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { EquipamentoRequest, EquipamentoResponse } from "@/types/equipamento";

const BASE_PATH = "/api/equipamento";

export async function getEquipamentos(): Promise<EquipamentoResponse[]> {
  return apiGet<EquipamentoResponse[]>(BASE_PATH);
}

export async function getEquipamento(id: number): Promise<EquipamentoResponse> {
  return apiGet<EquipamentoResponse>(`${BASE_PATH}/${id}`);
}

export async function createEquipamento(
  data: EquipamentoRequest
): Promise<EquipamentoResponse> {
  return apiPost<EquipamentoResponse>(BASE_PATH, data);
}

export async function updateEquipamento(
  id: number,
  data: EquipamentoRequest
): Promise<EquipamentoResponse> {
  return apiPut<EquipamentoResponse>(`${BASE_PATH}/${id}`, data);
}

export async function deleteEquipamento(id: number): Promise<void> {
  return apiDelete(`${BASE_PATH}/${id}`);
}
