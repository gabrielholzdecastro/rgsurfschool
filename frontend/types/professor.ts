export interface ProfessorRequest {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
}

export interface ProfessorResponse extends ProfessorRequest {
  id: number;
}
