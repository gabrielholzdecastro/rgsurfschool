import { AlunoResumo } from "./aluno";

export interface TripRequest {
  destino: string;
  descricao: string;
  dataSaida: string; // ISO date
  dataRetorno: string; // ISO date
  preco: number;
  vagas: number;
  alunosIds: number[];
}

export interface TripResponse {
  id: number;
  destino: string;
  descricao: string;
  dataSaida: string;
  dataRetorno: string;
  preco: number;
  vagas: number;
  alunos: AlunoResumo[];
}
