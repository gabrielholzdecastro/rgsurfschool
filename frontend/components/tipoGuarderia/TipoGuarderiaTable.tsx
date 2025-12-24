"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { TipoGuarderiaResponse, TempoGuarderia } from "@/types/tipoGuarderia";
import { formatCurrency } from "@/lib/utils";
import { Edit } from "lucide-react";

interface TipoGuarderiaTableProps {
    tipoGuarderias: TipoGuarderiaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onEdit?: (id: number) => void;
}

function formatTipoGuarderia(tipo: TempoGuarderia): string {
    const tipoMap: Record<TempoGuarderia, string> = {
        [TempoGuarderia.DIARIA]: "Diária",
        [TempoGuarderia.MENSAL]: "Mensal",
        [TempoGuarderia.TRIMESTRAL]: "Trimestral",
        [TempoGuarderia.ANUAL]: "Anual",
    };
    return tipoMap[tipo] || tipo;
}

export function TipoGuarderiaTable({
    tipoGuarderias,
    isLoading,
    error,
    onRetry,
    onEdit,
}: TipoGuarderiaTableProps) {
    const handleEdit = (tipoGuarderia: TipoGuarderiaResponse) => {
        if (onEdit) {
            onEdit(tipoGuarderia.id);
        }
    };

    const columns: Column<TipoGuarderiaResponse>[] = [
        {
            key: "tipo",
            label: "Tipo",
            render: (tipoGuarderia) => formatTipoGuarderia(tipoGuarderia.tipo),
            className: "text-sm font-medium text-gray-900",
        },
        {
            key: "valorPadrao",
            label: "Valor Padrão",
            render: (tipoGuarderia) => formatCurrency(tipoGuarderia.valorPadrao),
        },
    ];

    const actions: TableAction<TipoGuarderiaResponse>[] = [
        {
            label: "Alterar Valor",
            icon: <Edit className="w-4 h-4" />,
            onClick: handleEdit,
            variant: "secondary",
        },
    ];

    return (
        <DataTable
            data={tipoGuarderias}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhum tipo de guarderia cadastrado ainda."
            onRetry={onRetry}
            actions={actions}
        />
    );
}

