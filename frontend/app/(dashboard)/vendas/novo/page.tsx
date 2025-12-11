"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoja } from "@/hooks/useLoja";
import { useAlunos } from "@/hooks/useAlunos";
import { useEquipamentos } from "@/hooks/useEquipamentos";
import { useAulas } from "@/hooks/useAulas";
import { useTrips } from "@/hooks/useTrips";
import { vendaApi } from "@/lib/api/vendas";
import { MetodoPagamento, StatusPagamento, TipoItemVenda } from "@/types/venda";
import { Condicao } from "@/types/loja";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function NovaVendaPage() {
  const router = useRouter();
  const { produtos, isLoading: loadingProdutos } = useLoja();
  const { equipamentos, isLoading: loadingEquipamentos } = useEquipamentos();
  const { aulas, isLoading: loadingAulas } = useAulas();
  const { trips, isLoading: loadingTrips } = useTrips();
  const { alunos, isLoading: loadingAlunos } = useAlunos();

  const [tipoItem, setTipoItem] = useState<TipoItemVenda>(TipoItemVenda.LOJA);
  const [itemId, setItemId] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [modoComprador, setModoComprador] = useState<"aluno" | "avulso">("avulso");
  const [alunoId, setAlunoId] = useState<string>("");
  const [nomeComprador, setNomeComprador] = useState<string>("");
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>(MetodoPagamento.PIX);
  const [isPago, setIsPago] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Item selecionado e dados derivados
  const itemSelecionado = useMemo(() => {
    const id = Number(itemId);
    switch (tipoItem) {
      case TipoItemVenda.LOJA:
        return produtos.find((p) => p.id === id);
      case TipoItemVenda.EQUIPAMENTO:
        return equipamentos.find((e) => e.id === id);
      case TipoItemVenda.AULA:
        return aulas.find((a) => a.id === id);
      case TipoItemVenda.TRIP:
        return trips.find((t) => t.id === id);
      default:
        return undefined;
    }
  }, [aulas, equipamentos, itemId, produtos, tipoItem, trips]);

  const precoUnitario = useMemo(() => {
    if (!itemSelecionado) return 0;
    if ("preco" in itemSelecionado) return itemSelecionado.preco || 0;
    return 0;
  }, [itemSelecionado]);

  const estoqueAtual = useMemo(() => {
    if (!itemSelecionado) return 0;
    if ("qtdEstoque" in itemSelecionado) return itemSelecionado.qtdEstoque || 0;
    if ("capacidade" in itemSelecionado) return itemSelecionado.capacidade || 0;
    if ("vagas" in itemSelecionado) return itemSelecionado.vagas || 0;
    return 0;
  }, [itemSelecionado]);

  const valorTotal = precoUnitario * quantidade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    if (!itemId) {
      setErro("Selecione um item.");
      setLoading(false);
      return;
    }

    if (quantidade > estoqueAtual && (tipoItem === TipoItemVenda.LOJA || tipoItem === TipoItemVenda.EQUIPAMENTO || tipoItem === TipoItemVenda.AULA || tipoItem === TipoItemVenda.TRIP)) {
      setErro(`Quantidade indisponível. Disponível: ${estoqueAtual}`);
      setLoading(false);
      return;
    }

    // Se pendente, valida comprador
    if (!isPago) {
      if (modoComprador === "aluno" && !alunoId) {
        setErro("Selecione um aluno para venda fiado.");
        setLoading(false);
        return;
      }
      if (modoComprador === "avulso" && !nomeComprador.trim()) {
        setErro("Informe o nome do comprador para venda fiado.");
        setLoading(false);
        return;
      }
    }

    try {
      await vendaApi.realizarVenda({
        itemId: Number(itemId),
        tipoItem,
        quantidade,
        alunoId: modoComprador === "aluno" && alunoId ? Number(alunoId) : null,
        nomeComprador: modoComprador === "avulso" ? nomeComprador : undefined,
        metodoPagamento,
        statusPagamento: isPago ? StatusPagamento.PAGO : StatusPagamento.PENDENTE,
      });
      router.push("/vendas");
    } catch (err) {
      console.error(err);
      setErro(
        err instanceof Error
          ? err.message
          : "Erro ao realizar venda. Verifique os dados."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProdutos || loadingAlunos || loadingEquipamentos || loadingAulas || loadingTrips) {
    return <div className="p-8">Carregando dados...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Venda</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {/* Tipo e item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Item</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={tipoItem}
              onChange={(e) => {
                const novoTipo = e.target.value as TipoItemVenda;
                setTipoItem(novoTipo);
                setItemId("");
                setQuantidade(1);
              }}
            >
              <option value={TipoItemVenda.LOJA}>Lojinha</option>
              <option value={TipoItemVenda.EQUIPAMENTO}>Equipamento (seminovo)</option>
              <option value={TipoItemVenda.AULA}>Aula (serviço)</option>
              <option value={TipoItemVenda.TRIP}>Trip (serviço)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={itemId}
              onChange={(e) => {
                setItemId(e.target.value);
                setQuantidade(1);
              }}
              required
            >
              <option value="">Selecione...</option>
              {tipoItem === TipoItemVenda.LOJA &&
                produtos.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.qtdEstoque <= 0}>
                    {p.nome} (Estoque: {p.qtdEstoque} - R$ {p.preco.toFixed(2)})
                  </option>
                ))}
              {tipoItem === TipoItemVenda.EQUIPAMENTO &&
                equipamentos
                  .filter((e) => e.disponivelVenda && e.condicao === Condicao.SEMINOVO)
                  .map((e) => (
                    <option key={e.id} value={e.id} disabled={e.qtdEstoque <= 0}>
                      {e.nome} [{e.condicao}] - R$ {e.preco.toFixed(2)} (Estoque: {e.qtdEstoque})
                    </option>
                  ))}
              {tipoItem === TipoItemVenda.AULA &&
                aulas.map((a) => (
                  <option key={a.id} value={a.id} disabled={(a.capacidade ?? 0) <= 0}>
                    {a.titulo} ({a.capacidade ?? 0} vagas) - R$ {a.preco?.toFixed(2) ?? "0,00"} -{" "}
                    {a.dataHora ? formatDateTime(a.dataHora) : "Sem data"}
                  </option>
                ))}
              {tipoItem === TipoItemVenda.TRIP &&
                trips.map((t) => (
                  <option key={t.id} value={t.id} disabled={(t.vagas ?? 0) <= 0}>
                    {t.destino} ({t.vagas ?? 0} vagas) - R$ {t.preco?.toFixed(2) ?? "0,00"} - Saída:{" "}
                    {t.dataSaida ? formatDate(t.dataSaida) : "Sem data"}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade {tipoItem === TipoItemVenda.AULA || tipoItem === TipoItemVenda.TRIP ? "(vagas)" : ""}
          </label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={1}
              max={estoqueAtual}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              disabled={!itemId}
              required
            />
            {itemSelecionado && (
              <span className="text-sm text-gray-500">
                Max: {estoqueAtual}
              </span>
            )}
          </div>
        </div>

        {/* Comprador */}
        <div className="border-t pt-4 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comprador</label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`px-3 py-1 rounded-md text-sm ${
                modoComprador === "avulso"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setModoComprador("avulso")}
            >
              Nome Avulso
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-md text-sm ${
                modoComprador === "aluno"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setModoComprador("aluno")}
            >
              Aluno Cadastrado
            </button>
          </div>

          {modoComprador === "avulso" ? (
            <Input
              placeholder="Nome do comprador (opcional se pago)"
              value={nomeComprador}
              onChange={(e) => setNomeComprador(e.target.value)}
            />
          ) : (
            <select
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
            >
              <option value="">Selecione um aluno...</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Pagamento */}
        <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamento)}
            >
              {Object.values(MetodoPagamento).map((m) => (
                <option key={m} value={m}>
                  {m.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center mt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPago}
                onChange={(e) => setIsPago(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="text-gray-900 font-medium">Já está pago?</span>
            </label>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-gray-50 p-4 rounded-md mt-6 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-indigo-600">
            R$ {valorTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Processando..." : "Finalizar Venda"}
          </Button>
        </div>
      </form>
    </div>
  );
}
