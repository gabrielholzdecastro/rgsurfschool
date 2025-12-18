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
  const [editingProfessorId, setEditingProfessorId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfessores = useMemo(() => {
    return filterBySearch(professores, searchTerm, ["nome", "email", "telefone"]);
  }, [professores, searchTerm]);

  const handleNew = () => {
    setEditingProfessorId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingProfessorId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfessorId(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    refetch();
  };

  const modalTitle = editingProfessorId ? "Editar Professor" : "Novo Professor";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
        <Button onClick={handleNew}>Novo Professor</Button>
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
        onEdit={handleEdit}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="md"
      >
        <ProfessorForm
          professorId={editingProfessorId}
          onSuccess={handleSuccess}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

