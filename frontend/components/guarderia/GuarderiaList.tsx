"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { GuarderiaResponse } from "@/types/guarderia";
import { TempoGuarderia } from "@/types/tipoGuarderia";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface GuarderiaListProps {
    guarderias: GuarderiaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onMarcarPago?: (id: number) => void;
}

function getTipoNome(tipo: TempoGuarderia): string {
    switch (tipo) {
        case TempoGuarderia.DIARIA:
            return "Diária";
        case TempoGuarderia.MENSAL:
            return "Mensal";
        case TempoGuarderia.TRIMESTRAL:
            return "Trimestral";
        case TempoGuarderia.ANUAL:
            return "Anual";
        default:
            return tipo;
    }
}

export function GuarderiaList({
    guarderias,
    isLoading,
    error,
    onRetry,
    onDelete,
    onEdit,
    onMarcarPago,
}: GuarderiaListProps) {
    const handleDelete = (guarderia: GuarderiaResponse) => {
        if (onDelete && confirm("Tem certeza que deseja excluir esta guarderia?")) {
            onDelete(guarderia.id);
        }
    };

    const handleMarcarPago = (guarderia: GuarderiaResponse) => {
        if (onMarcarPago && confirm("Marcar esta guarderia como paga?")) {
            onMarcarPago(guarderia.id);
        }
    };

    const columns: Column<GuarderiaResponse>[] = [
        {
            key: "alunoNome",
            label: "Aluno",
            render: (guarderia) => (
                <span className="text-sm font-medium text-gray-900">
                    {guarderia.alunoNome}
                </span>
            ),
        },
        {
            key: "tipoGuarderia",
            label: "Tipo",
            render: (guarderia) => (
                <span className="text-sm text-gray-700">
                    {getTipoNome(guarderia.tipoGuarderia)}
                </span>
            ),
        },
        {
            key: "valor",
            label: "Valor",
            render: (guarderia) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(guarderia.valor)}
                </span>
            ),
        },
        {
            key: "dataInicio",
            label: "Data Início",
            render: (guarderia) => formatDate(guarderia.dataInicio),
        },
        {
            key: "dataFim",
            label: "Data Fim",
            render: (guarderia) => formatDate(guarderia.dataFim),
        },
        {
            key: "dataVencimento",
            label: "Data Vencimento",
            render: (guarderia) => (
                <span className={`text-sm ${
                    !guarderia.pago && new Date(guarderia.dataVencimento) < new Date()
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                }`}>
                    {formatDate(guarderia.dataVencimento)}
                </span>
            ),
        },
        {
            key: "pago",
            label: "Pagamento",
            render: (guarderia) => (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        guarderia.pago
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {guarderia.pago ? "Pago" : "Pendente"}
                </span>
            ),
        },
    ];

    const handleEdit = (guarderia: GuarderiaResponse) => {
        if (onEdit) {
            onEdit(guarderia.id);
        }
    };

    const actions: TableAction<GuarderiaResponse>[] = [
        {
            label: "Editar",
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
        {
            label: "Marcar como Pago",
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleMarcarPago,
            variant: "outline",
            condition: (guarderia) => !guarderia.pago,
            className: "text-green-600 border-green-600 hover:bg-green-50",
        },
    ];

    return (
        <DataTable
            data={guarderias}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhuma guarderia encontrada."
            onRetry={onRetry}
            actions={actions}
        />
    );
}

