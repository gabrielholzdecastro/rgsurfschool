"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EquipamentoRequest } from "@/types/equipamento";
import { Condicao } from "@/types/loja";
import {
  createEquipamento,
  getEquipamento,
  updateEquipamento,
} from "@/lib/api/equipamentos";

interface EquipamentoFormProps {
  equipamentoId?: number;
  onSuccess?: () => void;
}

export function EquipamentoForm({
  equipamentoId,
  onSuccess,
}: EquipamentoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!equipamentoId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EquipamentoRequest>({
    nome: "",
    qtdEstoque: 0,
    condicao: Condicao.EXCELENTE,
    preco: 0,
    custo: 0,
    dataAquisicao: new Date().toISOString().split("T")[0],
    fornecedor: "",
    emUso: true,
    disponivelVenda: false,
  });

  const loadEquipamento = useCallback(async () => {
    if (!equipamentoId) return;

    try {
      const equipamento = await getEquipamento(equipamentoId);
      setFormData({
        nome: equipamento.nome,
        qtdEstoque: equipamento.qtdEstoque,
        condicao: equipamento.condicao,
        preco: equipamento.preco,
        custo: equipamento.custo,
        dataAquisicao: equipamento.dataAquisicao,
        fornecedor: equipamento.fornecedor,
        emUso: equipamento.emUso,
        disponivelVenda: equipamento.disponivelVenda,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar equipamento"
      );
    } finally {
      setIsLoading(false);
    }
  }, [equipamentoId]);

  useEffect(() => {
    loadEquipamento();
  }, [loadEquipamento]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (equipamentoId) {
        await updateEquipamento(equipamentoId, formData);
      } else {
        await createEquipamento(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/equipamentos");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar equipamento"
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
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
      />

      <Input
        label="Quantidade em Estoque *"
        type="number"
        required
        min="0"
        value={formData.qtdEstoque}
        onChange={(e) =>
          setFormData({
            ...formData,
            qtdEstoque: parseInt(e.target.value) || 0,
          })
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
        <option value={Condicao.SEMINOVO}>Seminovo</option>
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

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData.emUso}
            onChange={(e) =>
              setFormData({ ...formData, emUso: e.target.checked })
            }
          />
          Em uso nas aulas
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData.disponivelVenda}
            onChange={(e) =>
              setFormData({ ...formData, disponivelVenda: e.target.checked })
            }
          />
          Disponível para venda como seminovo
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
