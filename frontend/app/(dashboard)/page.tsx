"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { useAlunos } from "@/hooks/useAlunos";
import { useAulas } from "@/hooks/useAulas";
import { useVendas } from "@/hooks/useVendas";
import { useProduto } from "@/hooks/useProduto";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, Users, DollarSign, Clock, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { alunos, isLoading: isLoadingAlunos } = useAlunos();
  const { aulas, isLoading: isLoadingAulas } = useAulas();
  const { vendas, loading: isLoadingVendas } = useVendas();
  const { produtos, isLoading: isLoadingProdutos } = useProduto();

  // Estatísticas do mês atual
  const stats = useMemo(() => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Total de alunos
    const totalAlunos = alunos.length;

    // Aulas do mês atual
    const aulasDoMes = aulas.filter((aula) => {
      const dataAula = new Date(aula.data);
      return dataAula >= primeiroDiaMes && dataAula <= ultimoDiaMes;
    });

    // Receita do mês (aulas pagas + vendas pagas)
    const receitaAulas = aulasDoMes
      .filter((aula) => aula.statusPagamento === "PAGO")
      .reduce((sum, aula) => sum + aula.valor, 0);

    const receitaVendas = vendas
      .filter((venda) => {
        const dataVenda = new Date(venda.dataVenda);
        return (
          dataVenda >= primeiroDiaMes &&
          dataVenda <= ultimoDiaMes &&
          venda.statusPagamento === "PAGO"
        );
      })
      .reduce((sum, venda) => sum + venda.valorTotal, 0);

    const receitaTotal = receitaAulas + receitaVendas;

    // Aulas pendentes
    const aulasPendentes = aulas.filter(
      (aula) => aula.statusPagamento === "PENDENTE"
    ).length;

    // Vendas pendentes
    const vendasPendentes = vendas.filter(
      (venda) => venda.statusPagamento === "PENDENTE"
    ).length;

    // Estoque baixo (produtos com estoque < 5)
    const estoqueBaixo = produtos.filter((produto) => produto.qtdEstoque < 5).length;

    return {
      totalAlunos,
      totalAulasMes: aulasDoMes.length,
      receitaTotal,
      aulasPendentes,
      vendasPendentes,
      estoqueBaixo,
    };
  }, [alunos, aulas, vendas, produtos]);

  // Próximas aulas (próximas 5)
  const proximasAulas = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return aulas
      .filter((aula) => {
        const dataAula = new Date(aula.data);
        return dataAula >= hoje;
      })
      .sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.horaInicio}`);
        const dataB = new Date(`${b.data}T${b.horaInicio}`);
        return dataA.getTime() - dataB.getTime();
      })
      .slice(0, 5);
  }, [aulas]);

  // Vendas recentes (últimas 5)
  const vendasRecentes = useMemo(() => {
    return [...vendas]
      .sort((a, b) => {
        const dataA = new Date(a.dataVenda);
        const dataB = new Date(b.dataVenda);
        return dataB.getTime() - dataA.getTime();
      })
      .slice(0, 5);
  }, [vendas]);

  const isLoading =
    isLoadingAlunos || isLoadingAulas || isLoadingVendas || isLoadingProdutos;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAlunos}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aulas do Mês</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAulasMes}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita do Mês</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.receitaTotal)}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aulas Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.aulasPendentes}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas Pendentes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.vendasPendentes}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <ShoppingBag className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.estoqueBaixo}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Aulas e Vendas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Aulas */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Próximas Aulas</h2>
            <Link href="/aulas">
              <Button variant="outline" className="text-sm">
                Ver todas
              </Button>
            </Link>
          </div>
          {proximasAulas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma aula agendada</p>
          ) : (
            <div className="space-y-3">
              {proximasAulas.map((aula) => (
                <div
                  key={aula.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{aula.nomeAluno}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(aula.data)} às {aula.horaInicio}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(aula.valor)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        aula.statusPagamento === "PAGO"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {aula.statusPagamento}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Vendas Recentes */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Vendas Recentes</h2>
            <Link href="/vendas">
              <Button variant="outline" className="text-sm">
                Ver todas
              </Button>
            </Link>
          </div>
          {vendasRecentes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma venda realizada</p>
          ) : (
            <div className="space-y-3">
              {vendasRecentes.map((venda) => (
                <div
                  key={venda.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{venda.nomeProduto}</p>
                    <p className="text-sm text-gray-600">
                      {venda.nomeComprador || "Sem comprador"} • {formatDate(venda.dataVenda)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(venda.valorTotal)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        venda.statusPagamento === "PAGO"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {venda.statusPagamento}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

