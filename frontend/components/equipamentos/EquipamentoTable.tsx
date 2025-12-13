"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EquipamentoResponse } from "@/types/equipamento";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteEquipamento } from "@/lib/api/equipamentos";

interface EquipamentoTableProps {
  equipamentos: EquipamentoResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: () => void;
}

export function EquipamentoTable({
  equipamentos,
  isLoading,
  error,
  onRetry,
  onDelete,
}: EquipamentoTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este equipamento?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteEquipamento(id);
      onDelete?.();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erro ao excluir equipamento"
      );
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

  if (equipamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum equipamento cadastrado ainda.
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
              Em Uso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Para Venda
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
          {equipamentos.map((equipamento) => (
            <tr key={equipamento.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {equipamento.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.qtdEstoque}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.condicao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.emUso ? "Sim" : "Não"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.disponivelVenda ? "Sim" : "Não"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(equipamento.preco)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(equipamento.custo)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(equipamento.dataAquisicao)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.fornecedor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/equipamentos/${equipamento.id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(equipamento.id)}
                  disabled={deletingId === equipamento.id}
                >
                  {deletingId === equipamento.id ? "Excluindo..." : "Excluir"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
