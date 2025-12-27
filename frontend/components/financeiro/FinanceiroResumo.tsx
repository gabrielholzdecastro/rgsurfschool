"use client";

import { Card } from "@/components/ui/Card";
import { ResumoFinanceiro } from "@/types/financeiro";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, CheckCircle, Clock, FileText } from "lucide-react";

interface FinanceiroResumoProps {
  resumo: ResumoFinanceiro;
  isLoading?: boolean;
}

export function FinanceiroResumo({ resumo, isLoading }: FinanceiroResumoProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Recebido */}
      <Card className="border-l-4 border-l-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Recebido</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(resumo.totalRecebido)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumo.quantidadePagos} {resumo.quantidadePagos === 1 ? "pagamento" : "pagamentos"}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Total Pendente */}
      <Card className="border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Pendente</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(resumo.totalPendente)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumo.quantidadePendentes} {resumo.quantidadePendentes === 1 ? "pendência" : "pendências"}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </Card>

      {/* Total Geral */}
      <Card className="border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Geral</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(resumo.totalGeral)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {resumo.quantidadeTotal} {resumo.quantidadeTotal === 1 ? "transação" : "transações"}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}

