"use client";

import { ProfessorForm } from "@/components/professores/ProfessorForm";

export default function NovoProfessorPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Professor</h1>
      <ProfessorForm />
    </div>
  );
}
