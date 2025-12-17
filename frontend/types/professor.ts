export interface ProfessorRequest {
  nome: string;
  email: string | null;
  telefone: string | null;
}

export interface ProfessorResponse {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
}

