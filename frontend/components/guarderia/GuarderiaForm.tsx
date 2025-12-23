"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { GuarderiaCreateRequest, GuarderiaUpdateRequest } from "@/types/guarderia";
import { createGuarderia, updateGuarderia, getGuarderia } from "@/lib/api/guarderia";
import { useAlunos } from "@/hooks/useAlunos";
import { useTipoGuarderia } from "@/hooks/useTipoGuarderia";
import { TempoGuarderia } from "@/types/tipoGuarderia";

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

export function GuarderiaForm({ guarderiaId, onSuccess, onClose }: GuarderiaFormProps) {
  const router = useRouter();
  const { alunos, isLoading: loadingAlunos } = useAlunos();
  const { tipoGuarderias, isLoading: loadingTipos } = useTipoGuarderia();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!guarderiaId);
  const [error, setError] = useState<string | null>(null);

  const [alunoId, setAlunoId] = useState<string>("");
  const [tipoGuarderiaId, setTipoGuarderiaId] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>(new Date().toISOString().split("T")[0]);
  const [pago, setPago] = useState<boolean>(false);
  const [dataFim, setDataFim] = useState<string>("");
  const [dataVencimento, setDataVencimento] = useState<string>("");

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
    if (tipoSelecionado && !valor) {
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

      <Select
        label="Tipo de Guarderia *"
        required
        value={tipoGuarderiaId}
        onChange={(e) => {
          setTipoGuarderiaId(e.target.value);
          const tipo = tipoGuarderias.find((t) => t.id === Number(e.target.value));
          if (tipo) {
            setValor(tipo.valorPadrao.toString());
          }
        }}
      >
        <option value="">Selecione um tipo...</option>
        {tipoGuarderias.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.tipo === TempoGuarderia.DIARIA && "Diária"}
            {tipo.tipo === TempoGuarderia.MENSAL && "Mensal"}
            {tipo.tipo === TempoGuarderia.TRIMESTRAL && "Trimestral"}
            {tipo.tipo === TempoGuarderia.ANUAL && "Anual"}
          </option>
        ))}
      </Select>

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
  );
}

