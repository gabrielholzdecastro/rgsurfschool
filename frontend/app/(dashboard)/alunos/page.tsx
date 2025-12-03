"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlunoList } from "@/components/alunos/AlunoList";
import { useAlunos } from "@/hooks/useAlunos";

export default function AlunosPage() {
  const { alunos, isLoading, error, refetch } = useAlunos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <Link href="/alunos/novo">
          <Button>Novo Aluno</Button>
        </Link>
      </div>

      <AlunoList
        alunos={alunos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
      />
    </div>
  );
}

