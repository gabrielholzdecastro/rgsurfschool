"use client";

import { AlunoCard } from "./AlunoCard";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AlunoFindAllResponse } from "@/types/aluno";

interface AlunoListProps {
  alunos: AlunoFindAllResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function AlunoList({
  alunos,
  isLoading,
  error,
  onRetry,
}: AlunoListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (alunos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum aluno cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alunos.map((aluno, index) => (
        <AlunoCard key={index} aluno={aluno} />
      ))}
    </div>
  );
}

