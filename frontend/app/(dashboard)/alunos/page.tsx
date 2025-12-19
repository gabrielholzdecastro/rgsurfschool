"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { AlunoList } from "@/components/alunos/AlunoList";
import { useAlunos } from "@/hooks/useAlunos";
import { Modal } from "@/components/ui/Modal";
import { AlunoForm } from "@/components/alunos/AlunoForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { deleteAluno } from "@/lib/api/alunos";
import { ApiError } from "@/lib/api/client";

export default function AlunosPage() {
  const { alunos, isLoading, error, refetch } = useAlunos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<number | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const filteredAlunos = useMemo(() => {
    return filterBySearch(alunos, searchTerm, ["nome", "email", "telefone"]);
  }, [alunos, searchTerm]);

  const handleNew = () => {
    setEditingAlunoId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingAlunoId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlunoId(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    refetch();
  };

  const handleDeleteClick = (id: number) => {
    setAlunoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (alunoToDelete === null) return;
    
    try {
      await deleteAluno(alunoToDelete);
      setIsDeleteModalOpen(false);
      setAlunoToDelete(null);
      refetch();
    } catch (e) {
      setIsDeleteModalOpen(false);
      if (e instanceof ApiError && e.status === 409) {
        setErrorMessage(e.message || "Não é possível excluir este aluno pois ele está relacionado a aulas ou vendas.");
        setIsErrorModalOpen(true);
      } else {
        setErrorMessage("Erro ao excluir aluno. Tente novamente.");
        setIsErrorModalOpen(true);
      }
      setAlunoToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAlunoToDelete(null);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  const modalTitle = editingAlunoId ? "Editar Aluno" : "Novo Aluno";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <Button onClick={handleNew}>Novo Aluno</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome, email ou telefone..."
      />

      <AlunoList
        alunos={filteredAlunos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="md"
      >
        <AlunoForm
          alunoId={editingAlunoId}
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
            Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
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
        title="Erro ao Excluir Aluno"
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

