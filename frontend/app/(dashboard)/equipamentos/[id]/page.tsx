"use client";

import { useParams } from "next/navigation";
import { EquipamentoForm } from "@/components/equipamentos/EquipamentoForm";

export default function EditarEquipamentoPage() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const id = idParam ? Number(idParam) : undefined;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Editar Equipamento</h1>
      {id ? (
        <EquipamentoForm equipamentoId={id} />
      ) : (
        <p>Equipamento não encontrado</p>
      )}
    </div>
  );
}
