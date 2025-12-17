"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Condicao, ProdutoRequest } from "@/types/produto";
import { createProduto, updateProduto, getProdutos } from "@/lib/api/produto";

interface ProdutoFormProps {
  produtoId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ProdutoForm({ produtoId, onSuccess, onClose }: ProdutoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!produtoId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProdutoRequest>({
    nome: "",
    qtdEstoque: 0,
    condicao: Condicao.BOM,
    preco: 0,
    custo: 0,
    dataAquisicao: new Date().toISOString().split("T")[0],
    fornecedor: "",
  });

  const loadProduto = useCallback(async () => {
    if (!produtoId) return;
    
    try {
      const produtos = await getProdutos();
      const produto = produtos.find((p) => p.id === produtoId);
      if (produto) {
        setFormData({
          nome: produto.nome,
          qtdEstoque: produto.qtdEstoque,
          condicao: produto.condicao,
          preco: produto.preco,
          custo: produto.custo,
          dataAquisicao: produto.dataAquisicao,
          fornecedor: produto.fornecedor,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produto"
      );
    } finally {
      setIsLoading(false);
    }
  }, [produtoId]);

  useEffect(() => {
    if (produtoId) {
      loadProduto();
    }
  }, [produtoId, loadProduto]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (produtoId) {
        await updateProduto(produtoId, formData);
      } else {
        await createProduto(formData);
      }
      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      } else if (!onClose) {
        router.push("/produtos");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar produto"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Input
        label="Nome *"
        type="text"
        required
        value={formData.nome}
        onChange={(e) =>
          setFormData({ ...formData, nome: e.target.value })
        }
      />

      <Input
        label="Quantidade em Estoque *"
        type="number"
        required
        min="0"
        value={formData.qtdEstoque}
        onChange={(e) =>
          setFormData({ ...formData, qtdEstoque: parseInt(e.target.value) || 0 })
        }
      />

      <Select
        label="Condição *"
        required
        value={formData.condicao}
        onChange={(e) =>
          setFormData({
            ...formData,
            condicao: e.target.value as Condicao,
          })
        }
      >
        <option value={Condicao.EXCELENTE}>Excelente</option>
        <option value={Condicao.BOM}>Bom</option>
      </Select>

      <Input
        label="Preço *"
        type="number"
        required
        min="0"
        step="0.01"
        value={formData.preco}
        onChange={(e) =>
          setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })
        }
      />

      <Input
        label="Custo *"
        type="number"
        required
        min="0"
        step="0.01"
        value={formData.custo}
        onChange={(e) =>
          setFormData({ ...formData, custo: parseFloat(e.target.value) || 0 })
        }
      />

      <Input
        label="Data de Aquisição *"
        type="date"
        required
        value={formData.dataAquisicao}
        onChange={(e) =>
          setFormData({ ...formData, dataAquisicao: e.target.value })
        }
      />

      <Input
        label="Fornecedor *"
        type="text"
        required
        value={formData.fornecedor}
        onChange={(e) =>
          setFormData({ ...formData, fornecedor: e.target.value })
        }
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              router.back();
            }
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Salvar
        </Button>
      </div>
    </form>
  );
}

