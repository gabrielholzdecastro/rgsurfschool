"use client";

import { useState, FormEvent, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TipoGuarderiaTable } from "@/components/tipoGuarderia/TipoGuarderiaTable";
import { TipoGuarderiaForm } from "@/components/tipoGuarderia/TipoGuarderiaForm";
import { GuarderiaCreateRequest, GuarderiaUpdateRequest } from "@/types/guarderia";
import { createGuarderia, updateGuarderia, getGuarderia } from "@/lib/api/guarderia";
import { useAlunos } from "@/hooks/useAlunos";
import { useTipoGuarderia } from "@/hooks/useTipoGuarderia";
import { TempoGuarderia, TipoGuarderiaResponse } from "@/types/tipoGuarderia";
import { Settings } from "lucide-react";

interface GuarderiaFormProps {
  guarderiaId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

function calcularDataFim(dataInicio: string, tipo: TempoGuarderia): string {
  const data = new Date(dataInicio);
  const novaData = new Date(data);

  switch (tipo) {
    case TempoGuarderia.DIARIA:
      novaData.setDate(novaData.getDate() + 1);
      break;
    case TempoGuarderia.MENSAL:
      novaData.setMonth(novaData.getMonth() + 1);
      break;
    case TempoGuarderia.TRIMESTRAL:
      novaData.setMonth(novaData.getMonth() + 3);
      break;
    case TempoGuarderia.ANUAL:
      novaData.setFullYear(novaData.getFullYear() + 1);
      break;
  }

  return novaData.toISOString().split("T")[0];
}

function calcularDataVencimento(dataInicio: string, tipo: TempoGuarderia): string {
  const data = new Date(dataInicio);
  const novaData = new Date(data);

  switch (tipo) {
    case TempoGuarderia.DIARIA:
      novaData.setDate(novaData.getDate() + 1);
      break;
    case TempoGuarderia.MENSAL:
    case TempoGuarderia.TRIMESTRAL:
    case TempoGuarderia.ANUAL:
      novaData.setMonth(novaData.getMonth() + 1);
      break;
  }

  return novaData.toISOString().split("T")[0];
}

function ordenarTiposGuarderia(tipoGuarderias: TipoGuarderiaResponse[]): TipoGuarderiaResponse[] {
  const ordem: Record<TempoGuarderia, number> = {
    [TempoGuarderia.DIARIA]: 1,
    [TempoGuarderia.MENSAL]: 2,
    [TempoGuarderia.TRIMESTRAL]: 3,
    [TempoGuarderia.ANUAL]: 4,
  };
  
  return [...tipoGuarderias].sort((a, b) => {
    const ordemA = ordem[a.tipo] ?? 999;
    const ordemB = ordem[b.tipo] ?? 999;
    return ordemA - ordemB;
  });
}

export function GuarderiaForm({ guarderiaId, onSuccess, onClose }: GuarderiaFormProps) {
  const router = useRouter();
  const { alunos, isLoading: loadingAlunos } = useAlunos();
  const { tipoGuarderias, isLoading: loadingTipos, refetch: refetchTipos } = useTipoGuarderia();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!guarderiaId);
  const [error, setError] = useState<string | null>(null);
  const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);
  const [isEditTipoModalOpen, setIsEditTipoModalOpen] = useState(false);
  const [editingTipoGuarderiaId, setEditingTipoGuarderiaId] = useState<number | undefined>(undefined);

  const [alunoId, setAlunoId] = useState<string>("");
  const [tipoGuarderiaId, setTipoGuarderiaId] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>(new Date().toISOString().split("T")[0]);
  const [pago, setPago] = useState<boolean>(false);
  const [dataFim, setDataFim] = useState<string>("");
  const [dataVencimento, setDataVencimento] = useState<string>("");

  const tipoGuarderiasOrdenadas = useMemo(() => ordenarTiposGuarderia(tipoGuarderias), [tipoGuarderias]);
  const tipoSelecionado = tipoGuarderias.find((t) => t.id === Number(tipoGuarderiaId));

  // Calcular datas quando tipo ou data início mudarem
  useEffect(() => {
    if (tipoSelecionado && dataInicio) {
      const tipo = tipoSelecionado.tipo;
      setDataFim(calcularDataFim(dataInicio, tipo));
      setDataVencimento(calcularDataVencimento(dataInicio, tipo));
    }
  }, [tipoSelecionado, dataInicio]);

  // Preencher valor quando tipo for selecionado
  useEffect(() => {
    if (tipoSelecionado) {
      // Atualiza o valor sempre que o tipo selecionado mudar (incluindo após edição)
      setValor(tipoSelecionado.valorPadrao.toString());
    }
  }, [tipoSelecionado]);

  const loadGuarderia = useCallback(async () => {
    if (!guarderiaId) return;

    setIsLoading(true);
    setError(null);
    try {
      const guarderia = await getGuarderia(guarderiaId);
      setAlunoId(guarderia.alunoId.toString());
      setTipoGuarderiaId(guarderia.tipoGuarderiaId.toString());
      setValor(guarderia.valor.toString());
      setDataInicio(guarderia.dataInicio);
      setPago(guarderia.pago);
      setDataFim(guarderia.dataFim);
      setDataVencimento(guarderia.dataVencimento);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar guarderia";
      setError(errorMessage);
      console.error("Erro ao carregar guarderia:", err);
    } finally {
      setIsLoading(false);
    }
  }, [guarderiaId]);

  useEffect(() => {
    if (guarderiaId) {
      loadGuarderia();
    } else {
      // Reset form quando não há guarderiaId (modo criação)
      setAlunoId("");
      setTipoGuarderiaId("");
      setValor("");
      setDataInicio(new Date().toISOString().split("T")[0]);
      setPago(false);
      setDataFim("");
      setDataVencimento("");
      setIsLoading(false);
      setError(null);
    }
  }, [guarderiaId, loadGuarderia]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!alunoId || !tipoGuarderiaId || !valor || !dataInicio) {
      setError("Preencha todos os campos obrigatórios");
      setIsSubmitting(false);
      return;
    }

    try {
      const data: GuarderiaCreateRequest | GuarderiaUpdateRequest = {
        alunoId: Number(alunoId),
        tipoGuarderiaId: Number(tipoGuarderiaId),
        valor: Number(valor),
        dataInicio,
        pago,
      };

      if (guarderiaId) {
        await updateGuarderia(guarderiaId, data);
      } else {
        await createGuarderia(data as GuarderiaCreateRequest);
      }

      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      } else if (!onClose) {
        router.push("/guarderia");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar guarderia");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || loadingAlunos || loadingTipos) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Select
        label="Aluno *"
        required
        value={alunoId}
        onChange={(e) => setAlunoId(e.target.value)}
      >
        <option value="">Selecione um aluno...</option>
        {alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>
            {aluno.nome}
          </option>
        ))}
      </Select>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plano de Guarderia *
        </label>
        <div className="flex gap-2">
          <Select
            required
            value={tipoGuarderiaId}
            onChange={(e) => {
              setTipoGuarderiaId(e.target.value);
              const tipo = tipoGuarderias.find((t) => t.id === Number(e.target.value));
              if (tipo) {
                setValor(tipo.valorPadrao.toString());
              }
            }}
            className="flex-1"
          >
            <option value="">Selecione um plano...</option>
            {tipoGuarderiasOrdenadas.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.tipo === TempoGuarderia.DIARIA && "Diária"}
                {tipo.tipo === TempoGuarderia.MENSAL && "Mensal"}
                {tipo.tipo === TempoGuarderia.TRIMESTRAL && "Trimestral"}
                {tipo.tipo === TempoGuarderia.ANUAL && "Anual"}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTiposModalOpen(true)}
            className="px-2 py-1 h-[37px] flex items-center justify-center"
            title="Gerenciar planos de guarderia"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Input
        label="Valor *"
        type="number"
        step="0.01"
        min="0"
        required
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <Input
        label="Data de Início *"
        type="date"
        required
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
      />

      {dataFim && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Data Fim: <span className="font-medium">{new Date(dataFim).toLocaleDateString("pt-BR")}</span></p>
        </div>
      )}

      {dataVencimento && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Data Vencimento: <span className="font-medium">{new Date(dataVencimento).toLocaleDateString("pt-BR")}</span></p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="pago"
          checked={pago}
          onChange={(e) => setPago(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="pago" className="text-sm font-medium text-gray-700">
          Já está pago?
        </label>
      </div>

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

      {/* Modal de Gerenciamento de Planos de Guarderia */}
      <Modal
        isOpen={isTiposModalOpen}
        onClose={() => setIsTiposModalOpen(false)}
        title="Gerenciar Planos de Guarderia"
        size="lg"
      >
        <TipoGuarderiaTable
          tipoGuarderias={tipoGuarderias}
          isLoading={loadingTipos}
          error={undefined}
          onRetry={refetchTipos}
          onEdit={(id) => {
            setEditingTipoGuarderiaId(id);
            setIsEditTipoModalOpen(true);
          }}
        />
      </Modal>

      {/* Modal de Edição de Plano de Guarderia */}
      {editingTipoGuarderiaId && (
        <Modal
          isOpen={isEditTipoModalOpen}
          onClose={() => {
            setIsEditTipoModalOpen(false);
            setEditingTipoGuarderiaId(undefined);
          }}
          title="Alterar Valor"
          size="lg"
        >
          <TipoGuarderiaForm
            tipoGuarderiaId={editingTipoGuarderiaId}
            onSuccess={() => {
              setIsEditTipoModalOpen(false);
              setEditingTipoGuarderiaId(undefined);
              refetchTipos();
            }}
            onClose={() => {
              setIsEditTipoModalOpen(false);
              setEditingTipoGuarderiaId(undefined);
            }}
          />
        </Modal>
      )}
    </>
  );
}

