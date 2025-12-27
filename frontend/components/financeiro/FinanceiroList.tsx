"use client";

import { DataTable, Column } from "@/components/ui/DataTable";
import { TransacaoFinanceira, TipoTransacao } from "@/types/financeiro";
import { formatDate, formatCurrency } from "@/lib/utils";

interface FinanceiroListProps {
  transacoes: TransacaoFinanceira[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

function getTipoBadge(tipo: TipoTransacao) {
  const badges = {
    AULA: {
      label: "Aula",
      className: "bg-blue-100 text-blue-800",
    },
    VENDA: {
      label: "Venda",
      className: "bg-purple-100 text-purple-800",
    },
    GUARDERIA: {
      label: "Guarderia",
      className: "bg-orange-100 text-orange-800",
    },
  };

  const badge = badges[tipo];
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

function getStatusBadge(status: "PAGO" | "PENDENTE") {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        status === "PAGO"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}

export function FinanceiroList({
  transacoes,
  isLoading,
  error,
  onRetry,
}: FinanceiroListProps) {
  const columns: Column<TransacaoFinanceira>[] = [
    {
      key: "data",
      label: "Data",
      render: (transacao) => (
        <span className="text-sm text-gray-900">{formatDate(transacao.data)}</span>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (transacao) => getTipoBadge(transacao.tipo),
    },
    {
      key: "descricao",
      label: "Descrição",
      render: (transacao) => (
        <span className="text-sm text-gray-900">{transacao.descricao}</span>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      render: (transacao) => (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(transacao.valor)}
        </span>
      ),
    },
    {
      key: "statusPagamento",
      label: "Status",
      render: (transacao) => getStatusBadge(transacao.statusPagamento),
    },
  ];

  return (
    <DataTable
      data={transacoes}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="Nenhuma transação encontrada."
      onRetry={onRetry}
      getRowId={(item) => `${item.tipo}-${item.id}`}
    />
  );
}

