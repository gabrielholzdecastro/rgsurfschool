export enum NivelAluno {
  INICIANTE = "INICIANTE",
  INTERMEDIARIO = "INTERMEDIARIO",
  AVANCADO = "AVANCADO",
}

export interface AlunoCreateRequest {
  nome: string;
  email: string;
  telefone: string;
  nivelAluno: NivelAluno;
  dataInicio: string; // ISO date string
}

export interface AlunoFindAllResponse {
  nome: string;
  email: string;
  telefone: string;
  nivelAluno: NivelAluno;
  dataInicio: string; // ISO date string
}

export interface AlunoCreateResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nivelAluno: NivelAluno;
  dataInicio: string; // ISO date string
}

