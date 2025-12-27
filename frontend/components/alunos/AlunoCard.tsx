import { Card } from "@/components/ui/Card";
import { AlunoFindAllResponse } from "@/types/aluno";

interface AlunoCardProps {
  aluno: AlunoFindAllResponse;
}

export function AlunoCard({ aluno }: AlunoCardProps) {
  return (
    <Card>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{aluno.nome}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Email:</span> {aluno.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Telefone:</span> {aluno.telefone || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
}

