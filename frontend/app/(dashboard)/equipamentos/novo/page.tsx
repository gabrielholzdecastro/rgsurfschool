"use client";

import { EquipamentoForm } from "@/components/equipamentos/EquipamentoForm";

export default function NovoEquipamentoPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Equipamento</h1>
      <EquipamentoForm />
    </div>
  );
}
