"use client";

import { useParams } from "next/navigation";
import { ProfessorForm } from "@/components/professores/ProfessorForm";

export default function EditarProfessorPage() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const id = idParam ? Number(idParam) : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Editar Professor</h1>
      <div className="max-w-2xl">
        {id ? <ProfessorForm professorId={id} /> : <p>Professor não encontrado</p>}
      </div>
    </div>
  );
}

