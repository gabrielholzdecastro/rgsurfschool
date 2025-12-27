"use client";

import { useMemo } from "react";
import { useAulas } from "./useAulas";
import { useVendas } from "./useVendas";
import { useGuarderia } from "./useGuarderia";
import { TransacaoFinanceira, ResumoFinanceiro, TipoTransacao } from "@/types/financeiro";
import { AulaResponse } from "@/types/aula";
import { VendaResponse } from "@/types/venda";
import { GuarderiaResponse } from "@/types/guarderia";
import { TempoGuarderia } from "@/types/tipoGuarderia";

function normalizarAula(aula: AulaResponse): TransacaoFinanceira {
  return {
    id: aula.id,
    tipo: "AULA" as TipoTransacao,
    descricao: `Aula - ${aula.nomeTipoAula} - ${aula.nomeAluno}`,
    valor: aula.valor,
    data: aula.data,
    statusPagamento: aula.statusPagamento,
    dadosOriginais: aula,
  };
}

function normalizarVenda(venda: VendaResponse): TransacaoFinanceira {
  return {
    id: venda.id,
    tipo: "VENDA" as TipoTransacao,
    descricao: `Venda - ${venda.nomeProduto} (${venda.quantidade}x) - ${venda.nomeComprador}`,
    valor: venda.valorTotal,
    data: venda.dataVenda,
    statusPagamento: venda.statusPagamento,
    dadosOriginais: venda,
  };
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

function normalizarGuarderia(guarderia: GuarderiaResponse): TransacaoFinanceira {
  return {
    id: guarderia.id,
    tipo: "GUARDERIA" as TipoTransacao,
    descricao: `Guarderia - ${getTipoNome(guarderia.tipoGuarderia)} - ${guarderia.alunoNome}`,
    valor: guarderia.valor,
    data: guarderia.dataInicio,
    statusPagamento: guarderia.pago ? "PAGO" : "PENDENTE",
    dadosOriginais: guarderia,
  };
}

export function useFinanceiro() {
  const { aulas, isLoading: isLoadingAulas, error: errorAulas, refetch: refetchAulas } = useAulas();
  const { vendas, loading: isLoadingVendas, error: errorVendas, recarregar: refetchVendas } = useVendas();
  const { guarderias, isLoading: isLoadingGuarderias, error: errorGuarderias, refetch: refetchGuarderias } = useGuarderia();

  const transacoes = useMemo(() => {
    const transacoesAulas = aulas.map(normalizarAula);
    const transacoesVendas = vendas.map(normalizarVenda);
    const transacoesGuarderias = guarderias.map(normalizarGuarderia);

    const todas = [...transacoesAulas, ...transacoesVendas, ...transacoesGuarderias];
    
    // Ordenar por data (mais recente primeiro)
    return todas.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataB - dataA;
    });
  }, [aulas, vendas, guarderias]);

  const resumo = useMemo((): ResumoFinanceiro => {
    const totalRecebido = transacoes
      .filter((t) => t.statusPagamento === "PAGO")
      .reduce((sum, t) => sum + t.valor, 0);

    const totalPendente = transacoes
      .filter((t) => t.statusPagamento === "PENDENTE")
      .reduce((sum, t) => sum + t.valor, 0);

    const totalGeral = transacoes.reduce((sum, t) => sum + t.valor, 0);

    const quantidadePagos = transacoes.filter((t) => t.statusPagamento === "PAGO").length;
    const quantidadePendentes = transacoes.filter((t) => t.statusPagamento === "PENDENTE").length;

    return {
      totalRecebido,
      totalPendente,
      totalGeral,
      quantidadePagos,
      quantidadePendentes,
      quantidadeTotal: transacoes.length,
    };
  }, [transacoes]);

  const isLoading = isLoadingAulas || isLoadingVendas || isLoadingGuarderias;
  const error = errorAulas || errorVendas || errorGuarderias;

  const refetch = () => {
    refetchAulas();
    refetchVendas();
    refetchGuarderias();
  };

  return {
    transacoes,
    resumo,
    isLoading,
    error,
    refetch,
  };
}

