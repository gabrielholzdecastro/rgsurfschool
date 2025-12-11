import { Card } from "@/components/ui/Card";
import { AlunoFindAllResponse } from "@/types/aluno";
import { formatDate } from "@/lib/utils";

interface AlunoCardProps {
  aluno: AlunoFindAllResponse;
}

export function AlunoCard({ aluno }: AlunoCardProps) {
  const statusClasses = aluno.ativo
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-700";

  return (
    <Card>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{aluno.nome}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusClasses}`}>
            {aluno.ativo ? "Ativo" : "Inativo"}
          </span>
          {aluno.dataUltimaAula && (
            <span className="text-xs text-gray-500">
              Última aula: {formatDate(aluno.dataUltimaAula)}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Email:</span> {aluno.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Telefone:</span> {aluno.telefone}
          </p>
          <p>
            <span className="font-medium">Nível:</span> {aluno.nivelAluno}
          </p>
          {aluno.dataInicio && (
            <p>
              <span className="font-medium">Data de Início:</span>{" "}
              {formatDate(aluno.dataInicio)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
