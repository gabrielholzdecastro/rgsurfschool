"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { AlunoFindAllResponse } from "@/types/aluno";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

interface AlunoListProps {
  alunos: AlunoFindAllResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function AlunoList({
  alunos,
  isLoading,
  error,
  onRetry,
  onDelete,
  onEdit,
}: AlunoListProps) {

  const columns: Column<AlunoFindAllResponse>[] = [
    {
      key: "nome",
      label: "Nome",
      className: "text-sm font-medium text-gray-900",
    },
    {
      key: "telefone",
      label: "Telefone",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "nivelAluno",
      label: "Nível",
    },
    {
      key: "dataInicio",
      label: "Data Início",
      render: (aluno) =>
        aluno.dataInicio ? formatDate(aluno.dataInicio) : "-",
    },
  ];

  const handleEdit = (aluno: AlunoFindAllResponse) => {
    if (onEdit) {
      onEdit(aluno.id);
    } else {
      console.warn("onEdit não foi fornecido");
    }
  };

  const actions: TableAction<AlunoFindAllResponse>[] = [
    {
      label: "Alterar",
      icon: <Edit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: "secondary",
    },
    {
      label: "Excluir",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (aluno) => {
        if (onDelete) {
          onDelete(aluno.id);
        }
      },
      variant: "danger",
    },
  ];

  return (
    <DataTable
      data={alunos}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="Nenhum aluno cadastrado ainda."
      onRetry={onRetry}
      actions={actions}
    />
  );
}
