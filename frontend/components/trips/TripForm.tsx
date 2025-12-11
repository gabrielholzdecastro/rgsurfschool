"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TripRequest } from "@/types/trip";
import { createTrip, getTrip, updateTrip } from "@/lib/api/trips";
import { useAlunos } from "@/hooks/useAlunos";

interface TripFormProps {
  tripId?: number;
  onSuccess?: () => void;
}

export function TripForm({ tripId, onSuccess }: TripFormProps) {
  const router = useRouter();
  const { alunos, isLoading: carregandoAlunos } = useAlunos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!tripId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TripRequest>({
    destino: "",
    descricao: "",
    dataSaida: new Date().toISOString().split("T")[0],
    dataRetorno: new Date().toISOString().split("T")[0],
    preco: 0,
    vagas: 0,
    alunosIds: [],
  });

  const loadTrip = useCallback(async () => {
    if (!tripId) return;

    try {
      const trip = await getTrip(tripId);
      setFormData({
        destino: trip.destino,
        descricao: trip.descricao || "",
        dataSaida: trip.dataSaida,
        dataRetorno: trip.dataRetorno,
        preco: trip.preco || 0,
        vagas: trip.vagas || 0,
        alunosIds: trip.alunos.map((a) => a.id),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar trip");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ids = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setFormData({ ...formData, alunosIds: ids });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (tripId) {
        await updateTrip(tripId, formData);
      } else {
        await createTrip(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/trips");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || carregandoAlunos) {
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
        label="Destino *"
        type="text"
        required
        value={formData.destino}
        onChange={(e) =>
          setFormData({ ...formData, destino: e.target.value })
        }
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          rows={3}
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
        />
      </div>

      <Input
        label="Data de Saída *"
        type="date"
        required
        value={formData.dataSaida}
        onChange={(e) =>
          setFormData({ ...formData, dataSaida: e.target.value })
        }
      />

      <Input
        label="Data de Retorno *"
        type="date"
        required
        value={formData.dataRetorno}
        onChange={(e) =>
          setFormData({ ...formData, dataRetorno: e.target.value })
        }
      />

      <Input
        label="Preço *"
        type="number"
        min="0"
        step="0.01"
        required
        value={formData.preco}
        onChange={(e) =>
          setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })
        }
      />

      <Input
        label="Vagas *"
        type="number"
        min="0"
        required
        value={formData.vagas}
        onChange={(e) =>
          setFormData({ ...formData, vagas: parseInt(e.target.value) || 0 })
        }
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alunos participantes
        </label>
        <select
          multiple
          value={formData.alunosIds.map(String)}
          onChange={handleMultiSelectChange}
          className="w-full px-3 py-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Selecione os alunos que confirmaram presença.
        </p>
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
