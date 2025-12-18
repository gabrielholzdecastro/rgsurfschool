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

export default function AlunosPage() {
  const { alunos, isLoading, error, refetch } = useAlunos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id: number) => {
    try {
      await deleteAluno(id);
      refetch();
    } catch (e) {
      alert("Erro ao excluir aluno");
    }
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
        onDelete={handleDelete}
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
    </div>
  );
}

