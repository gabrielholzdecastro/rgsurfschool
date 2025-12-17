"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { NivelAluno, AlunoCreateRequest } from "@/types/aluno";
import { createAluno } from "@/lib/api/alunos";

interface AlunoFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AlunoForm({ onSuccess, onClose }: AlunoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AlunoCreateRequest>({
    nome: "",
    email: "",
    telefone: "",
    nivelAluno: NivelAluno.INICIANTE,
    dataInicio: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createAluno(formData);
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
        err instanceof Error ? err.message : "Erro ao criar aluno"
      );
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
        label="Telefone *"
        type="tel"
        required
        value={formData.telefone}
        onChange={(e) =>
          setFormData({ ...formData, telefone: e.target.value })
        }
      />

      <Select
        label="Nível *"
        required
        value={formData.nivelAluno}
        onChange={(e) =>
          setFormData({
            ...formData,
            nivelAluno: e.target.value as NivelAluno,
          })
        }
      >
        <option value={NivelAluno.INICIANTE}>Iniciante</option>
        <option value={NivelAluno.INTERMEDIARIO}>Intermediário</option>
        <option value={NivelAluno.AVANCADO}>Avançado</option>
      </Select>

      <Input
        label="Data de Início"
        type="date"
        value={formData.dataInicio}
        onChange={(e) =>
          setFormData({ ...formData, dataInicio: e.target.value })
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

