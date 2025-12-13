"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfessorResponse } from "@/types/professor";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { deleteProfessor } from "@/lib/api/professores";

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

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProfessor(id);
      onDelete?.();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erro ao excluir professor"
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

  if (professores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum professor cadastrado ainda.
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
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Especialidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {professores.map((professor) => (
            <tr key={professor.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {professor.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {professor.email || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {professor.telefone || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {professor.especialidade || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/professores/${professor.id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(professor.id)}
                  disabled={deletingId === professor.id}
                >
                  {deletingId === professor.id ? "Excluindo..." : "Excluir"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
