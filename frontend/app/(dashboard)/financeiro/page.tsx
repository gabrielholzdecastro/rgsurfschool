"use client";

import { useState, useMemo } from "react";
import { useFinanceiro } from "@/hooks/useFinanceiro";
import { FinanceiroResumo } from "@/components/financeiro/FinanceiroResumo";
import { FinanceiroList } from "@/components/financeiro/FinanceiroList";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { filterBySearch } from "@/lib/utils";
import { TipoTransacao, StatusPagamentoUnificado, ResumoFinanceiro } from "@/types/financeiro";

// Função helper para comparar apenas a parte da data (sem horas)
function compararApenasData(data1: Date, data2: Date): number {
  const d1 = new Date(data1.getFullYear(), data1.getMonth(), data1.getDate());
  const d2 = new Date(data2.getFullYear(), data2.getMonth(), data2.getDate());
  return d1.getTime() - d2.getTime();
}

export default function FinanceiroPage() {
  const { transacoes, isLoading, error, refetch } = useFinanceiro();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoTransacao | "TODOS">("TODOS");
  const [filtroStatus, setFiltroStatus] = useState<StatusPagamentoUnificado | "TODOS">("TODOS");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const transacoesFiltradas = useMemo(() => {
    let filtradas = transacoes;

    // Filtro por tipo
    if (filtroTipo !== "TODOS") {
      filtradas = filtradas.filter((t) => t.tipo === filtroTipo);
    }

    // Filtro por status
    if (filtroStatus !== "TODOS") {
      filtradas = filtradas.filter((t) => t.statusPagamento === filtroStatus);
    }

    // Filtro por data início
    if (dataInicio) {
      const dataInicioObj = new Date(dataInicio);
      filtradas = filtradas.filter((t) => {
        const dataTransacao = new Date(t.data);
        return compararApenasData(dataTransacao, dataInicioObj) >= 0;
      });
    }

    // Filtro por data fim
    if (dataFim) {
      const dataFimObj = new Date(dataFim);
      filtradas = filtradas.filter((t) => {
        const dataTransacao = new Date(t.data);
        return compararApenasData(dataTransacao, dataFimObj) <= 0;
      });
    }

    // Busca por descrição
    filtradas = filterBySearch(filtradas, searchTerm, ["descricao"]);

    return filtradas;
  }, [transacoes, filtroTipo, filtroStatus, dataInicio, dataFim, searchTerm]);

  const resumoFiltrado = useMemo((): ResumoFinanceiro => {
    const totalRecebido = transacoesFiltradas
      .filter((t) => t.statusPagamento === "PAGO")
      .reduce((sum, t) => sum + t.valor, 0);

    const totalPendente = transacoesFiltradas
      .filter((t) => t.statusPagamento === "PENDENTE")
      .reduce((sum, t) => sum + t.valor, 0);

    const totalGeral = transacoesFiltradas.reduce((sum, t) => sum + t.valor, 0);

    const quantidadePagos = transacoesFiltradas.filter((t) => t.statusPagamento === "PAGO").length;
    const quantidadePendentes = transacoesFiltradas.filter((t) => t.statusPagamento === "PENDENTE").length;

    return {
      totalRecebido,
      totalPendente,
      totalGeral,
      quantidadePagos,
      quantidadePendentes,
      quantidadeTotal: transacoesFiltradas.length,
    };
  }, [transacoesFiltradas]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
      </div>

      {/* Resumo Financeiro */}
      <FinanceiroResumo resumo={resumoFiltrado} isLoading={isLoading} />

      {/* Filtros e Busca */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Data Início"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <Input
            type="date"
            label="Data Fim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Pesquisar por descrição..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as TipoTransacao | "TODOS")}
            >
              <option value="TODOS">Todos os tipos</option>
              <option value="AULA">Aulas</option>
              <option value="VENDA">Vendas</option>
              <option value="GUARDERIA">Guarderia</option>
            </Select>
            <Select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as StatusPagamentoUnificado | "TODOS")}
            >
              <option value="TODOS">Todos os status</option>
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <FinanceiroList
        transacoes={transacoesFiltradas}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
      />
    </div>
  );
}

