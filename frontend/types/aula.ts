
import { AlunoResumo } from "./aluno";
import { ProfessorResponse } from "./professor";

export interface AulaRequest {
  titulo: string;
  descricao: string;
  dataHora: string; // ISO string
  duracaoMinutos: number;
  preco: number;
  capacidade: number;
  professoresIds: number[];
  alunosIds: number[];
}

export interface AulaResponse {
  id: number;
  titulo: string;
  descricao: string;
  dataHora: string;
  duracaoMinutos: number;
  preco: number;
  capacidade: number;
  professores: ProfessorResponse[];
  alunos: AlunoResumo[];
}
export type TipoAula = "SURF" | "KITE_SURF";
export type StatusPagamento = "PAGO" | "PENDENTE";

export interface AulaCreateRequest {
    alunoId: number;
    data: string; // yyyy-MM-dd
    horaInicio: string; // HH:mm
    horaFim: string; // HH:mm
    tipoAula: TipoAula;
    valor: number;
    statusPagamento: StatusPagamento;
}

export interface AulaResponse {
    id: number;
    alunoId: number;
    nomeAluno: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    tipoAula: TipoAula;
    valor: number;
    statusPagamento: StatusPagamento;
}


