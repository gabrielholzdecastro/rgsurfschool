"use client";

import { DataTable, Column, TableAction } from "@/components/ui/DataTable";
import { VendaResponse, StatusPagamento } from "@/types/venda";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface VendaListProps {
    vendas: VendaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: (id: number) => Promise<void>;
    quitarVenda: (id: number) => Promise<void>;
    onEdit?: (id: number) => void;
}

export function VendaList({ 
    vendas, 
    isLoading, 
    error, 
    onRetry,
    onDelete,
    quitarVenda,
    onEdit
}: VendaListProps) {

    const handleDelete = async (venda: VendaResponse) => {
        if (!confirm("Tem certeza que deseja excluir esta venda?")) {
            return;
        }

        if (onDelete) {
            try {
                await onDelete(venda.id);
            } catch (err) {
                alert(err instanceof Error ? err.message : "Erro ao excluir venda");
            }
        }
    };

    const handleQuitar = async (venda: VendaResponse) => {
        if (confirm("Confirmar pagamento desta venda?")) {
            await quitarVenda(venda.id);
        }
    };

    const columns: Column<VendaResponse>[] = [
        {
            key: "dataVenda",
            label: "Data",
            render: (venda) => formatDate(venda.dataVenda),
        },
        {
            key: "nomeProduto",
            label: "Produto",
            render: (venda) => (
                <span className="text-sm text-gray-900">
                    {venda.nomeProduto} ({venda.quantidade})
                </span>
            ),
        },
        {
            key: "nomeComprador",
            label: "Comprador",
            render: (venda) => venda.nomeComprador || "-",
        },
        {
            key: "valorTotal",
            label: "Valor Total",
            render: (venda) => (
                <span className="text-sm text-gray-900">
                    {formatCurrency(venda.valorTotal)}
                </span>
            ),
        },
        {
            key: "statusPagamento",
            label: "Status",
            render: (venda) => (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        venda.statusPagamento === StatusPagamento.PAGO
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {venda.statusPagamento}
                </span>
            ),
        },
    ];

    const handleEdit = (venda: VendaResponse) => {
        if (onEdit) {
            onEdit(venda.id);
        }
    };

    const actions: TableAction<VendaResponse>[] = [
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
        {
            label: "Quitar",
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: handleQuitar,
            variant: "outline",
            condition: (venda) => venda.statusPagamento === StatusPagamento.PENDENTE,
            className: "text-green-600 border-green-600 hover:bg-green-50",
        },
    ];

    return (
        <DataTable
            data={vendas}
            columns={columns}
            isLoading={isLoading}
            error={error}
            emptyMessage="Nenhuma venda encontrada."
            onRetry={onRetry}
            actions={actions}
        />
    );
}
