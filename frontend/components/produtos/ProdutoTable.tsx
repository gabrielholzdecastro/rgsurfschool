"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { ProdutoResponse } from "@/types/produto";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

interface ProdutoTableProps {
  produtos: ProdutoResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function ProdutoTable({
  produtos,
  isLoading,
  error,
  onRetry,
  onDelete,
  onEdit,
}: ProdutoTableProps) {
  const handleDelete = (produto: ProdutoResponse) => {
    if (onDelete) {
      onDelete(produto.id);
    }
  };

  const columns: Column<ProdutoResponse>[] = [
    {
      key: "nome",
      label: "Nome",
      className: "text-sm font-medium text-gray-900",
    },
    {
      key: "qtdEstoque",
      label: "Estoque",
    },
    {
      key: "condicao",
      label: "Condição",
    },
    {
      key: "preco",
      label: "Preço",
      render: (produto) => formatCurrency(produto.preco),
    },
    {
      key: "custo",
      label: "Custo",
      render: (produto) => formatCurrency(produto.custo),
    },
    {
      key: "dataAquisicao",
      label: "Data Aquisição",
      render: (produto) => formatDate(produto.dataAquisicao),
    },
    {
      key: "fornecedor",
      label: "Fornecedor",
    },
  ];

  const handleEdit = (produto: ProdutoResponse) => {
    if (onEdit) {
      onEdit(produto.id);
    }
  };

  const actions: TableAction<ProdutoResponse>[] = [
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
      data={produtos}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="Nenhum produto cadastrado ainda."
      onRetry={onRetry}
      actions={actions}
    />
  );
}

