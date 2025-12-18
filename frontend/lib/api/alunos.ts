import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type {
  AlunoCreateRequest,
  AlunoCreateResponse,
  AlunoFindAllResponse,
} from "@/types/aluno";

export async function getAlunos(): Promise<AlunoFindAllResponse[]> {
  return apiGet<AlunoFindAllResponse[]>("/api/aluno");
}

export async function getAluno(id: number): Promise<AlunoFindAllResponse> {
  return apiGet<AlunoFindAllResponse>(`/api/aluno/${id}`);
}

export async function createAluno(
  data: AlunoCreateRequest
): Promise<AlunoCreateResponse> {
  return apiPost<AlunoCreateResponse>("/api/aluno", data);
}

export async function updateAluno(
  id: number,
  data: AlunoCreateRequest
): Promise<AlunoCreateResponse> {
  return apiPut<AlunoCreateResponse>(`/api/aluno/${id}`, data);
}

export async function deleteAluno(id: number): Promise<void> {
  return apiDelete(`/api/aluno/${id}`);
}

