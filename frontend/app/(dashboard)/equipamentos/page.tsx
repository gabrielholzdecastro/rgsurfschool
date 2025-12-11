"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EquipamentoTable } from "@/components/equipamentos/EquipamentoTable";
import { useEquipamentos } from "@/hooks/useEquipamentos";

export default function EquipamentosPage() {
  const { equipamentos, isLoading, error, refetch } = useEquipamentos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Equipamentos</h1>
        <Link href="/equipamentos/novo">
          <Button>Novo Equipamento</Button>
        </Link>
      </div>

      <EquipamentoTable
        equipamentos={equipamentos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />
    </div>
  );
}
