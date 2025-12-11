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
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nivelAluno: NivelAluno;
  dataInicio: string; // ISO date string
  ativo: boolean;
  dataUltimaAula: string | null;
}

export interface AlunoCreateResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nivelAluno: NivelAluno;
  dataInicio: string; // ISO date string
}

export interface AlunoResumo {
  id: number;
  nome: string;
}
