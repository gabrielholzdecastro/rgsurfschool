import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { ProfessorRequest, ProfessorResponse } from "@/types/professor";

const BASE_PATH = "/api/professor";

export async function getProfessores(): Promise<ProfessorResponse[]> {
  return apiGet<ProfessorResponse[]>(BASE_PATH);
}

export async function getProfessor(id: number): Promise<ProfessorResponse> {
  return apiGet<ProfessorResponse>(`${BASE_PATH}/${id}`);
}

export async function createProfessor(
  data: ProfessorRequest
): Promise<ProfessorResponse> {
  return apiPost<ProfessorResponse>(BASE_PATH, data);
}

export async function updateProfessor(
  id: number,
  data: ProfessorRequest
): Promise<ProfessorResponse> {
  return apiPut<ProfessorResponse>(`${BASE_PATH}/${id}`, data);
}

export async function deleteProfessor(id: number): Promise<void> {
  return apiDelete(`${BASE_PATH}/${id}`);
}
