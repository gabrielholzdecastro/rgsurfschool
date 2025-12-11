"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfessorRequest } from "@/types/professor";
import {
  createProfessor,
  getProfessor,
  updateProfessor,
} from "@/lib/api/professores";

interface ProfessorFormProps {
  professorId?: number;
  onSuccess?: () => void;
}

export function ProfessorForm({ professorId, onSuccess }: ProfessorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!professorId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfessorRequest>({
    nome: "",
    email: "",
    telefone: "",
    especialidade: "",
  });

  const loadProfessor = useCallback(async () => {
    if (!professorId) return;

    try {
      const professor = await getProfessor(professorId);
      setFormData({
        nome: professor.nome,
        email: professor.email,
        telefone: professor.telefone,
        especialidade: professor.especialidade,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar professor"
      );
    } finally {
      setIsLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    loadProfessor();
  }, [loadProfessor]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (professorId) {
        await updateProfessor(professorId, formData);
      } else {
        await createProfessor(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/professores");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar professor"
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
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <Input
        label="Telefone"
        type="tel"
        value={formData.telefone}
        onChange={(e) =>
          setFormData({ ...formData, telefone: e.target.value })
        }
      />

      <Input
        label="Especialidade"
        type="text"
        value={formData.especialidade}
        onChange={(e) =>
          setFormData({ ...formData, especialidade: e.target.value })
        }
      />

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
