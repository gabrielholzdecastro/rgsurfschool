"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProfessorRequest } from "@/types/professor";
import { createProfessor, updateProfessor, getProfessores } from "@/lib/api/professor";

interface ProfessorFormProps {
  professorId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ProfessorForm({ professorId, onSuccess, onClose }: ProfessorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!professorId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfessorRequest>({
    nome: "",
    email: null,
    telefone: null,
  });

  const loadProfessor = useCallback(async () => {
    if (!professorId) return;
    
    try {
      const professores = await getProfessores();
      const professor = professores.find((p) => p.id === professorId);
      if (professor) {
        setFormData({
          nome: professor.nome,
          email: professor.email,
          telefone: professor.telefone,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar professor"
      );
    } finally {
      setIsLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    if (professorId) {
      loadProfessor();
    } else {
      // Reset form quando não há professorId (modo criação)
      setFormData({
        nome: "",
        email: null,
        telefone: null,
      });
      setIsLoading(false);
      setError(null);
    }
  }, [professorId, loadProfessor]);

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
      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      } else if (!onClose) {
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
        onChange={(e) =>
          setFormData({ ...formData, nome: e.target.value })
        }
      />

      <Input
        label="Email"
        type="email"
        value={formData.email || ""}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value || null })
        }
      />

      <Input
        label="Telefone"
        type="tel"
        value={formData.telefone || ""}
        onChange={(e) =>
          setFormData({ ...formData, telefone: e.target.value || null })
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

