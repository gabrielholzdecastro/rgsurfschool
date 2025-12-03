"use client";

import { AlunoForm } from "@/components/alunos/AlunoForm";

export default function NovoAlunoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Aluno</h1>
      <div className="max-w-2xl">
        <AlunoForm />
      </div>
    </div>
  );
}

