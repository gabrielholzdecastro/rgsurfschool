"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
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

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteLoja(id);
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir item");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum item cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Condição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Custo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Aquisição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fornecedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {produto.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {produto.qtdEstoque}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {produto.condicao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(produto.preco)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(produto.custo)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(produto.dataAquisicao)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {produto.fornecedor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="secondary"
                  className="p-1.5"
                  title="Editar"
                  onClick={() => router.push(`/loja/${produto.id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  className="p-1.5 text-white"
                  title="Excluir"
                  onClick={() => handleDelete(produto.id)}
                  disabled={deletingId === produto.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
