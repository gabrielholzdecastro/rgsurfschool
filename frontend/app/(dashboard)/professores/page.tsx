"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProfessorTable } from "@/components/professores/ProfessorTable";
import { useProfessores } from "@/hooks/useProfessores";
import { Modal } from "@/components/ui/Modal";
import { ProfessorForm } from "@/components/professores/ProfessorForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { deleteProfessor } from "@/lib/api/professor";
import { ApiError } from "@/lib/api/client";

export default function ProfessoresPage() {
  const { professores, isLoading, error, refetch } = useProfessores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessorId, setEditingProfessorId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<number | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleDeleteClick = (id: number) => {
    setProfessorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (professorToDelete === null) return;
    
    try {
      await deleteProfessor(professorToDelete);
      setIsDeleteModalOpen(false);
      setProfessorToDelete(null);
      refetch();
    } catch (e) {
      setIsDeleteModalOpen(false);
      if (e instanceof ApiError && e.status === 409) {
        setErrorMessage(e.message || "Não é possível excluir este professor pois ele está relacionado a aulas.");
        setIsErrorModalOpen(true);
      } else {
        setErrorMessage("Erro ao excluir professor. Tente novamente.");
        setIsErrorModalOpen(true);
      }
      setProfessorToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProfessorToDelete(null);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
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
        onDelete={handleDeleteClick}
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        title="Erro ao Excluir Professor"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {errorMessage}
          </p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleCloseErrorModal}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

