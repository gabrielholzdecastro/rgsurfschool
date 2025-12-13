"use client";


import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { AlunoFindAllResponse } from "@/types/aluno";

interface AlunoListProps {
  alunos: AlunoFindAllResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function AlunoList({
  alunos,
  isLoading,
  error,
  onRetry,
}: AlunoListProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (alunos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum aluno cadastrado ainda.</p>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alunos.map((aluno) => (
        <AlunoCard key={aluno.id} aluno={aluno} />
      ))}
=======
>>>>>>> Stashed changes
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nível
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Início
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {aluno.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aluno.telefone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aluno.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aluno.nivelAluno}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {aluno.dataInicio ? new Date(aluno.dataInicio).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {/* Actions placeholder */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<<<<<<< Updated upstream
=======
>>>>>>> 99b3da6e2fb43d66adfd6d6a92cddf3db95853cd
>>>>>>> Stashed changes
    </div>
  );
}
