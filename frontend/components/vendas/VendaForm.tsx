"use client";

import { useState, useEffect, useCallback } from "react";
import { useProduto } from "@/hooks/useProduto";
import { useAlunos } from "@/hooks/useAlunos";
import { vendaApi } from "@/lib/api/vendas";
import { MetodoPagamento, StatusPagamento, VendaResponse } from "@/types/venda";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface VendaFormProps {
  vendaId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function VendaForm({ vendaId, onSuccess, onClose }: VendaFormProps) {
  const { produtos, isLoading: loadingProdutos } = useProduto();
  const { alunos, isLoading: loadingAlunos } = useAlunos();

  const [produtoId, setProdutoId] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [modoComprador, setModoComprador] = useState<"aluno" | "avulso">("avulso");
  const [alunoId, setAlunoId] = useState<string>("");
  const [nomeComprador, setNomeComprador] = useState<string>("");
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>(MetodoPagamento.PIX);
  const [isPago, setIsPago] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [isLoadingVenda, setIsLoadingVenda] = useState(!!vendaId);
  const [erro, setErro] = useState<string | null>(null);

  const loadVenda = useCallback(async () => {
    if (!vendaId) return;

    setIsLoadingVenda(true);
    setErro(null);
    try {
      console.log("Buscando venda com ID:", vendaId);
      const venda = await vendaApi.buscarVenda(vendaId);
      console.log("Venda carregada:", venda);
      
      // Usar produtoId diretamente
      if (venda.produtoId) {
        setProdutoId(venda.produtoId.toString());
      }
      setQuantidade(venda.quantidade);
      
      // Determinar modo comprador baseado no alunoId
      if (venda.alunoId) {
        setModoComprador("aluno");
        setAlunoId(venda.alunoId.toString());
      } else {
        setModoComprador("avulso");
        setNomeComprador(venda.nomeComprador || "");
      }
      
      setMetodoPagamento(venda.metodoPagamento);
      setIsPago(venda.statusPagamento === StatusPagamento.PAGO);
    } catch (err) {
      console.error("Erro detalhado ao carregar venda:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar venda";
      setErro(`Erro ao carregar venda: ${errorMessage}. Verifique se o backend está rodando.`);
    } finally {
      setIsLoadingVenda(false);
    }
  }, [vendaId]);

  useEffect(() => {
    if (vendaId) {
      // Aguardar produtos e alunos carregarem antes de buscar venda
      if (!loadingProdutos && !loadingAlunos && produtos.length > 0) {
        loadVenda();
      }
    } else {
      // Reset form quando não há vendaId (modo criação)
      setProdutoId("");
      setQuantidade(1);
      setModoComprador("avulso");
      setAlunoId("");
      setNomeComprador("");
      setMetodoPagamento(MetodoPagamento.PIX);
      setIsPago(true);
      setErro(null);
      setIsLoadingVenda(false);
    }
  }, [vendaId, loadingProdutos, loadingAlunos, produtos.length, loadVenda]);

  const produtoSelecionado = produtos.find((p) => p.id === Number(produtoId));
  const precoUnitario = produtoSelecionado?.preco || 0;
  const estoqueAtual = produtoSelecionado?.qtdEstoque || 0;
  const valorTotal = precoUnitario * quantidade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    if (!produtoId) {
      setErro("Selecione um produto.");
      setLoading(false);
      return;
    }

    if (quantidade > estoqueAtual) {
      setErro(`Estoque insuficiente. Disponível: ${estoqueAtual}`);
      setLoading(false);
      return;
    }

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
      const vendaData = {
        produtoId: Number(produtoId),
        quantidade,
        alunoId: modoComprador === "aluno" && alunoId ? Number(alunoId) : null,
        nomeComprador: modoComprador === "avulso" ? nomeComprador : undefined,
        metodoPagamento,
        statusPagamento: isPago ? StatusPagamento.PAGO : StatusPagamento.PENDENTE,
      };

      if (vendaId) {
        await vendaApi.atualizarVenda(vendaId, vendaData);
      } else {
        await vendaApi.realizarVenda(vendaData);
      }

      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErro(vendaId ? "Erro ao atualizar venda. Verifique os dados." : "Erro ao realizar venda. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProdutos || loadingAlunos || isLoadingVenda) {
    return <div className="p-8">Carregando dados...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
        <select
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
          value={produtoId}
          onChange={(e) => {
            setProdutoId(e.target.value);
            setQuantidade(1);
          }}
          required
        >
          <option value="">Selecione um produto...</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id} disabled={p.qtdEstoque <= 0}>
              {p.nome} (Estoque: {p.qtdEstoque} - R$ {p.preco.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={1}
            max={estoqueAtual}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            disabled={!produtoId}
            required
          />
          {produtoSelecionado && (
            <span className="text-sm text-gray-500">Max: {estoqueAtual}</span>
          )}
        </div>
      </div>

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

      <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4">
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

      <div className="bg-gray-50 p-4 rounded-md mt-6 flex justify-between items-center">
        <span className="text-lg font-medium text-gray-700">Total:</span>
        <span className="text-2xl font-bold text-indigo-600">
          R$ {valorTotal.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          Salvar
        </Button>
      </div>
    </form>
  );
}

