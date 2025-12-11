"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AulaResponse } from "@/types/aula";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { deleteAula } from "@/lib/api/aulas";

interface AulaTableProps {
  aulas: AulaResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: () => void;
}

export function AulaTable({
  aulas,
  isLoading,
  error,
  onRetry,
  onDelete,
}: AulaTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteAula(id);
      onDelete?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir aula");
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

  if (aulas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma aula cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duração
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Professores
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alunos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {aulas.map((aula) => (
            <tr key={aula.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {aula.titulo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(aula.dataHora)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aula.duracaoMinutos} min
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(aula.preco)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aula.capacidade}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aula.professores.length > 0
                  ? aula.professores.map((p) => p.nome).join(", ")
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aula.alunos.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/aulas/${aula.id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(aula.id)}
                  disabled={deletingId === aula.id}
                >
                  {deletingId === aula.id ? "Excluindo..." : "Excluir"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
