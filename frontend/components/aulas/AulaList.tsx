"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { AulaResponse } from "@/types/aula";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface AulaListProps {
    aulas: AulaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: (id: number) => void;
    onPay?: (id: number) => void;
}

export function AulaList({
    aulas,
    isLoading,
    error,
    onRetry,
    onDelete,
    onPay,
}: AulaListProps) {
    const router = useRouter();

    const handleDelete = (aula: AulaResponse) => {
        if (onDelete) {
            if (confirm("Tem certeza que deseja excluir esta aula?")) {
                onDelete(aula.id);
            }
        }
    };

    const handlePay = (aula: AulaResponse) => {
        if (onPay) {
            if (confirm("Confirmar pagamento desta aula?")) {
                onPay(aula.id);
            }
        }
    };

    const columns: Column<AulaResponse>[] = [
        {
            key: "nomeAluno",
            label: "Aluno",
            className: "text-sm font-medium text-gray-900",
        },
        {
            key: "data",
            label: "Data",
            render: (aula) => formatDate(aula.data),
        },
        {
            key: "horaInicio",
            label: "Horário",
            render: (aula) => `${aula.horaInicio} - ${aula.horaFim}`,
        },
        {
            key: "nomeTipoAula",
            label: "Tipo",
            render: (aula) => aula.nomeTipoAula,
        },
        {
            key: "valor",
            label: "Valor",
            render: (aula) => formatCurrency(aula.valor),
        },
        {
            key: "statusPagamento",
            label: "Status",
            render: (aula) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        aula.statusPagamento === "PAGO"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {aula.statusPagamento}
                </span>
            ),
        },
    ];

    const actions: TableAction<AulaResponse>[] = [
        {
            label: "Alterar",
            icon: <Edit className="w-4 h-4" />,
            onClick: (aula) => router.push(`/aulas/${aula.id}`),
            variant: "secondary",
        },
        {
            label: "Excluir",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: handleDelete,
            variant: "danger",
            className: "text-white",
        },
        {
            label: "Quitar",
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handlePay,
            variant: "outline",
            condition: (aula) => aula.statusPagamento === "PENDENTE",
            className: "text-green-600 border-green-600 hover:bg-green-50",
        },
    ];

    return (
        <DataTable
            data={aulas}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhuma aula agendada."
            onRetry={onRetry}
            actions={actions}
        />
    );
}
