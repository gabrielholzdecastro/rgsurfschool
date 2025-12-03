import { apiGet, apiPost } from "./client";
import type {
  AlunoCreateRequest,
  AlunoCreateResponse,
  AlunoFindAllResponse,
} from "@/types/aluno";

export async function getAlunos(): Promise<AlunoFindAllResponse[]> {
  return apiGet<AlunoFindAllResponse[]>("/api/aluno");
}

export async function createAluno(
  data: AlunoCreateRequest
): Promise<AlunoCreateResponse> {
  return apiPost<AlunoCreateResponse>("/api/aluno", data);
}

