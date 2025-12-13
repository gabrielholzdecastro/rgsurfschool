"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProfessorTable } from "@/components/professores/ProfessorTable";
import { useProfessores } from "@/hooks/useProfessores";

export default function ProfessoresPage() {
  const { professores, isLoading, error, refetch } = useProfessores();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
        <Link href="/professores/novo">
          <Button>Novo Professor</Button>
        </Link>
      </div>

      <ProfessorTable
        professores={professores}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />
    </div>
  );
}
