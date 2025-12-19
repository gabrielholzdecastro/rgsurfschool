"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { TipoAulaResponse } from "@/types/tipoAula";
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

interface TipoAulaTableProps {
    tipoAulas: TipoAulaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

export function TipoAulaTable({
    tipoAulas,
    isLoading,
    error,
    onRetry,
    onDelete,
    onEdit,
}: TipoAulaTableProps) {
    const handleDelete = (tipoAula: TipoAulaResponse) => {
        if (onDelete) {
            onDelete(tipoAula.id);
        }
    };

    const columns: Column<TipoAulaResponse>[] = [
        {
            key: "nome",
            label: "Nome",
            className: "text-sm font-medium text-gray-900",
        },
        {
            key: "valorPadrao",
            label: "Valor Padrão",
            render: (tipoAula) => formatCurrency(tipoAula.valorPadrao),
        },
    ];

    const handleEdit = (tipoAula: TipoAulaResponse) => {
        if (onEdit) {
            onEdit(tipoAula.id);
        }
    };

    const actions: TableAction<TipoAulaResponse>[] = [
        {
            label: "Alterar",
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
    ];

    return (
        <DataTable
            data={tipoAulas}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhum tipo de aula cadastrado ainda."
            onRetry={onRetry}
            actions={actions}
        />
    );
}

