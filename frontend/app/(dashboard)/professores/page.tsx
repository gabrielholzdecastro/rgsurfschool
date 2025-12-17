"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProfessorTable } from "@/components/professores/ProfessorTable";
import { useProfessores } from "@/hooks/useProfessores";
import { Modal } from "@/components/ui/Modal";
import { ProfessorForm } from "@/components/professores/ProfessorForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";

export default function ProfessoresPage() {
  const { professores, isLoading, error, refetch } = useProfessores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfessores = useMemo(() => {
    return filterBySearch(professores, searchTerm, ["nome", "email", "telefone"]);
  }, [professores, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Professor</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome, email ou telefone..."
      />

      <ProfessorTable
        professores={filteredProfessores}
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

