"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { ProfessorResponse } from "@/types/professor";
import { Edit, Trash2 } from "lucide-react";

interface ProfessorTableProps {
  professores: ProfessorResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function ProfessorTable({
  professores,
  isLoading,
  error,
  onRetry,
  onDelete,
  onEdit,
}: ProfessorTableProps) {
  const handleDelete = (professor: ProfessorResponse) => {
    if (onDelete) {
      onDelete(professor.id);
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

  const handleEdit = (professor: ProfessorResponse) => {
    if (onEdit) {
      onEdit(professor.id);
    }
  };

  const actions: TableAction<ProfessorResponse>[] = [
    {
      label: "Alterar",
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: "secondary",
    },
    {
      label: "Excluir",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: "danger",
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

