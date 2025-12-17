"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { ProfessorResponse } from "@/types/professor";
import { deleteProfessor } from "@/lib/api/professor";
import { Edit, Trash2 } from "lucide-react";

interface ProfessorTableProps {
  professores: ProfessorResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: () => void;
}

export function ProfessorTable({
  professores,
  isLoading,
  error,
  onRetry,
  onDelete,
}: ProfessorTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (professor: ProfessorResponse) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) {
      return;
    }

    setDeletingId(professor.id);
    try {
      await deleteProfessor(professor.id);
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir professor");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: Column<ProfessorResponse>[] = [
    {
      key: "nome",
      label: "Nome",
      className: "text-sm font-medium text-gray-900",
    },
    {
      key: "email",
      label: "Email",
      render: (professor) => professor.email || "-",
    },
    {
      key: "telefone",
      label: "Telefone",
      render: (professor) => professor.telefone || "-",
    },
  ];

  const actions: TableAction<ProfessorResponse>[] = [
    {
      label: "Alterar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (professor) => router.push(`/professores/${professor.id}`),
      variant: "secondary",
    },
    {
      label: "Excluir",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: "danger",
      disabled: (professor) => deletingId === professor.id,
      className: "text-white",
    },
  ];

  return (
    <DataTable
      data={professores}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="Nenhum professor cadastrado ainda."
      onRetry={onRetry}
      actions={actions}
    />
  );
}

