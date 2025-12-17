"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProfessorTable } from "@/components/professores/ProfessorTable";
import { useProfessores } from "@/hooks/useProfessores";
import { Modal } from "@/components/ui/Modal";
import { ProfessorForm } from "@/components/professores/ProfessorForm";

export default function ProfessoresPage() {
  const { professores, isLoading, error, refetch } = useProfessores();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Professor</Button>
      </div>

      <ProfessorTable
        professores={professores}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Professor"
        size="md"
      >
        <ProfessorForm
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

