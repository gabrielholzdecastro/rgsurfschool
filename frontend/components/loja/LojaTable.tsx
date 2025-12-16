"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { LojaResponse } from "@/types/loja";
import { formatDate, formatCurrency } from "@/lib/utils";
import { deleteLoja } from "@/lib/api/loja";
import { Edit, Trash2 } from "lucide-react";

interface LojaTableProps {
  produtos: LojaResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: () => void;
}

export function LojaTable({
  produtos,
  isLoading,
  error,
  onRetry,
  onDelete,
}: LojaTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (produto: LojaResponse) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    setDeletingId(produto.id);
    try {
      await deleteLoja(produto.id);
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir produto");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: Column<LojaResponse>[] = [
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

  const actions: TableAction<LojaResponse>[] = [
    {
      label: "Alterar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (produto) => router.push(`/loja/${produto.id}`),
      variant: "secondary",
    },
    {
      label: "Excluir",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: "danger",
      disabled: (produto) => deletingId === produto.id,
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

