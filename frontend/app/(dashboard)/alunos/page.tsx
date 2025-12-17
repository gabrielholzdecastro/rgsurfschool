"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlunoList } from "@/components/alunos/AlunoList";
import { useAlunos } from "@/hooks/useAlunos";
import { Modal } from "@/components/ui/Modal";
import { AlunoForm } from "@/components/alunos/AlunoForm";

export default function AlunosPage() {
  const { alunos, isLoading, error, refetch } = useAlunos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Aluno</Button>
      </div>

      <AlunoList
        alunos={alunos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Aluno"
        size="md"
      >
        <AlunoForm
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

