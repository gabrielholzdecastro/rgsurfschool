"use client";

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AulaRequest } from "@/types/aula";
import { createAula, getAula, updateAula } from "@/lib/api/aulas";
import { useProfessores } from "@/hooks/useProfessores";
import { useAlunos } from "@/hooks/useAlunos";

interface AulaFormProps {
  aulaId?: number;
  onSuccess?: () => void;
}

export function AulaForm({ aulaId, onSuccess }: AulaFormProps) {
  const router = useRouter();
  const { professores, isLoading: carregandoProfessores } = useProfessores();
  const { alunos, isLoading: carregandoAlunos } = useAlunos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!aulaId);
  const [error, setError] = useState<string | null>(null);

  const defaultDateTime = useMemo(
    () => new Date().toISOString().slice(0, 16),
    []
  );

  const [formData, setFormData] = useState<AulaRequest>({
    titulo: "",
    descricao: "",
    dataHora: defaultDateTime,
    duracaoMinutos: 60,
    preco: 0,
    capacidade: 8,
    professoresIds: [],
    alunosIds: [],
  });

  const loadAula = useCallback(async () => {
    if (!aulaId) return;

    try {
      const aula = await getAula(aulaId);
      setFormData({
        titulo: aula.titulo,
        descricao: aula.descricao || "",
        dataHora: aula.dataHora
          ? new Date(aula.dataHora).toISOString().slice(0, 16)
          : defaultDateTime,
        duracaoMinutos: aula.duracaoMinutos || 0,
        preco: aula.preco || 0,
        capacidade: aula.capacidade || 0,
        professoresIds: aula.professores.map((p) => p.id),
        alunosIds: aula.alunos.map((a) => a.id),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar aula");
    } finally {
      setIsLoading(false);
    }
  }, [aulaId, defaultDateTime]);

  useEffect(() => {
    loadAula();
  }, [loadAula]);

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    key: "professoresIds" | "alunosIds"
  ) => {
    const ids = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setFormData({ ...formData, [key]: ids });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: AulaRequest = {
        ...formData,
        dataHora: formData.dataHora,
      };

      if (aulaId) {
        await updateAula(aulaId, payload);
      } else {
        await createAula(payload);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/aulas");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar aula");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || carregandoAlunos || carregandoProfessores) {
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
        label="Título *"
        type="text"
        required
        value={formData.titulo}
        onChange={(e) =>
          setFormData({ ...formData, titulo: e.target.value })
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
        label="Data e Hora *"
        type="datetime-local"
        required
        value={formData.dataHora}
        onChange={(e) =>
          setFormData({ ...formData, dataHora: e.target.value })
        }
      />

      <Input
        label="Duração (minutos)"
        type="number"
        min="0"
        value={formData.duracaoMinutos}
        onChange={(e) =>
          setFormData({
            ...formData,
            duracaoMinutos: parseInt(e.target.value) || 0,
          })
        }
      />

      <Input
        label="Preço"
        type="number"
        min="0"
        step="0.01"
        value={formData.preco}
        onChange={(e) =>
          setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })
        }
      />

      <Input
        label="Capacidade"
        type="number"
        min="0"
        value={formData.capacidade}
        onChange={(e) =>
          setFormData({
            ...formData,
            capacidade: parseInt(e.target.value) || 0,
          })
        }
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professores
        </label>
        <select
          multiple
          value={formData.professoresIds.map(String)}
          onChange={(e) => handleMultiSelectChange(e, "professoresIds")}
          className="w-full px-3 py-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          {professores.map((professor) => (
            <option key={professor.id} value={professor.id}>
              {professor.nome}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Segure Ctrl (Windows) ou Command (Mac) para selecionar múltiplos.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alunos
        </label>
        <select
          multiple
          value={formData.alunosIds.map(String)}
          onChange={(e) => handleMultiSelectChange(e, "alunosIds")}
          className="w-full px-3 py-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Use múltipla seleção para atribuir os alunos que farão a aula.
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
=======
>>>>>>> Stashed changes
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Button } from "@/components/ui/Button";
import { AulaCreateRequest, TipoAula, StatusPagamento } from "@/types/aula";
import { createAula, updateAula } from "@/lib/api/aula";
import { useAlunos } from "@/hooks/useAlunos";

interface AulaFormProps {
    initialData?: AulaCreateRequest & { id?: number };
    onSuccess?: () => void;
}

export function AulaForm({ initialData, onSuccess }: AulaFormProps) {
    const router = useRouter();
    const { alunos } = useAlunos();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<AulaCreateRequest>({
        alunoId: initialData?.alunoId || 0,
        data: initialData?.data || new Date().toISOString().split("T")[0],
        horaInicio: initialData?.horaInicio || "",
        horaFim: initialData?.horaFim || "",
        tipoAula: initialData?.tipoAula || "SURF",
        valor: initialData?.valor || 0,
        statusPagamento: initialData?.statusPagamento || "PENDENTE",
    });

    // Auto-fill Hora Fim logic (1h duration)
    useEffect(() => {
        if (formData.horaInicio && !initialData?.horaFim) { // Only auto-fill if not editing an existing horaFim
            const [hours, minutes] = formData.horaInicio.split(":").map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setHours(date.getHours() + 1);

            const newHours = date.getHours().toString().padStart(2, "0");
            const newMinutes = date.getMinutes().toString().padStart(2, "0");

            setFormData((prev) => ({ ...prev, horaFim: `${newHours}:${newMinutes}` }));
        }
    }, [formData.horaInicio, initialData?.horaFim]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (formData.alunoId === 0) {
            setError("Selecione um aluno");
            setIsSubmitting(false);
            return;
        }

        try {
            if (initialData?.id) {
                await updateAula(initialData.id, formData);
            } else {
                await createAula(formData);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/aulas");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar aula");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                value={formData.alunoId > 0 ? formData.alunoId.toString() : ""}
                onChange={(e) => setFormData({ ...formData, alunoId: Number(e.target.value) })}
            >
                <option value="">Selecione um aluno...</option>
                {alunos.map((aluno: any) => (
                    // Assuming AlunoFindAllResponse has id, if not we might need to adjust useAlunos or AlunoResponse
                    <option key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                    </option>
                ))}
            </Select>

            <Input
                label="Data *"
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <TimeSelect
                    label="Hora Início *"
                    required
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                />
                <TimeSelect
                    label="Hora Fim *"
                    required
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                />
            </div>

            <Select
                label="Tipo de Aula *"
                required
                value={formData.tipoAula}
                onChange={(e) => setFormData({ ...formData, tipoAula: e.target.value as TipoAula })}
            >
                <option value="SURF">Surfe</option>
                <option value="KITE_SURF">Kite Surf</option>
            </Select>

            <Input
                label="Valor (R$) *"
                type="number"
                step="0.01"
                required
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
            />

            <Select
                label="Status Pagamento *"
                required
                value={formData.statusPagamento}
                onChange={(e) => setFormData({ ...formData, statusPagamento: e.target.value as StatusPagamento })}
            >
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
            </Select>

            <div className="flex gap-4 pt-4">
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
<<<<<<< Updated upstream
=======
>>>>>>> 99b3da6e2fb43d66adfd6d6a92cddf3db95853cd
>>>>>>> Stashed changes
}
