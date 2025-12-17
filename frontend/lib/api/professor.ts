import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { ProfessorRequest, ProfessorResponse } from "@/types/professor";

export async function getProfessores(): Promise<ProfessorResponse[]> {
  return apiGet<ProfessorResponse[]>("/api/professores");
}

export async function createProfessor(data: ProfessorRequest): Promise<ProfessorResponse> {
  return apiPost<ProfessorResponse>("/api/professores", data);
}

export async function updateProfessor(
  id: number,
  data: ProfessorRequest
): Promise<ProfessorResponse> {
  return apiPut<ProfessorResponse>(`/api/professores/${id}`, data);
}

export async function deleteProfessor(id: number): Promise<void> {
  return apiDelete(`/api/professores/${id}`);
}

