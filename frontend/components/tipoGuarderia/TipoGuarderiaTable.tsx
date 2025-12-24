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

function ordenarTiposGuarderia(tipoGuarderias: TipoGuarderiaResponse[]): TipoGuarderiaResponse[] {
    const ordem: Record<TempoGuarderia, number> = {
        [TempoGuarderia.DIARIA]: 1,
        [TempoGuarderia.MENSAL]: 2,
        [TempoGuarderia.TRIMESTRAL]: 3,
        [TempoGuarderia.ANUAL]: 4,
    };
    
    return [...tipoGuarderias].sort((a, b) => {
        const ordemA = ordem[a.tipo] ?? 999;
        const ordemB = ordem[b.tipo] ?? 999;
        return ordemA - ordemB;
    });
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

    const tipoGuarderiasOrdenadas = ordenarTiposGuarderia(tipoGuarderias);

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
            data={tipoGuarderiasOrdenadas}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhum tipo de guarderia cadastrado ainda."
            onRetry={onRetry}
            actions={actions}
        />
    );
}

