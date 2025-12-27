"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlunoCreateRequest } from "@/types/aluno";
import { createAluno, updateAluno, getAluno } from "@/lib/api/alunos";

interface AlunoFormProps {
  alunoId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AlunoForm({ alunoId, onSuccess, onClose }: AlunoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!alunoId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AlunoCreateRequest>({
    nome: "",
    email: "",
    telefone: "",
  });

  const loadAluno = useCallback(async () => {
    if (!alunoId) return;

    setIsLoading(true);
    setError(null);
    try {
      const aluno = await getAluno(alunoId);
      setFormData({
        nome: aluno.nome,
        email: aluno.email || "",
        telefone: aluno.telefone || "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar aluno";
      setError(errorMessage);
      console.error("Erro ao carregar aluno:", err);
    } finally {
      setIsLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    if (alunoId) {
      loadAluno();
    } else {
      // Reset form quando não há alunoId (modo criação)
      setFormData({
        nome: "",
        email: "",
        telefone: "",
      });
      setIsLoading(false);
      setError(null);
    }
  }, [alunoId, loadAluno]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (alunoId) {
        await updateAluno(alunoId, formData);
      } else {
        await createAluno(formData);
      }
      if (onClose) {
        onClose();
      }
      if (onSuccess) {
        onSuccess();
      } else if (!onClose) {
        router.push("/alunos");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar aluno"
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
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <Input
        label="Telefone"
        type="tel"
        value={formData.telefone}
        onChange={(e) =>
          setFormData({ ...formData, telefone: e.target.value })
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

