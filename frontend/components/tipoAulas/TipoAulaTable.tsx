"use client";

import { useState } from "react";
import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { TipoAulaResponse } from "@/types/tipoAula";
import { formatCurrency } from "@/lib/utils";
import { deleteTipoAula } from "@/lib/api/tipoAula";
import { Edit, Trash2 } from "lucide-react";

interface TipoAulaTableProps {
    tipoAulas: TipoAulaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: () => void;
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
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (tipoAula: TipoAulaResponse) => {
        if (!confirm("Tem certeza que deseja excluir este tipo de aula?")) {
            return;
        }

        setDeletingId(tipoAula.id);
        try {
            await deleteTipoAula(tipoAula.id);
            if (onDelete) {
                onDelete();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao excluir tipo de aula");
        } finally {
            setDeletingId(null);
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
            disabled: (tipoAula) => deletingId === tipoAula.id,
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

