"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { GuarderiaList } from "@/components/guarderia/GuarderiaList";
import { useGuarderia } from "@/hooks/useGuarderia";
import { Modal } from "@/components/ui/Modal";
import { GuarderiaForm } from "@/components/guarderia/GuarderiaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { updateGuarderia } from "@/lib/api/guarderia";

export default function GuarderiaPage() {
  const { guarderias, isLoading, error, refetch, excluirGuarderia } = useGuarderia();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuarderiaId, setEditingGuarderiaId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuarderias = useMemo(() => {
    return filterBySearch(guarderias, searchTerm, ["alunoNome", "tipoGuarderia"]);
  }, [guarderias, searchTerm]);

  const handleNew = () => {
    setEditingGuarderiaId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingGuarderiaId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGuarderiaId(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    refetch();
  };

  const handleDelete = async (id: number) => {
    try {
      await excluirGuarderia(id);
    } catch (error) {
      console.error("Erro ao excluir guarderia:", error);
      alert("Erro ao excluir guarderia. Tente novamente.");
    }
  };

  const handleMarcarPago = async (id: number) => {
    try {
      await updateGuarderia(id, { pago: true });
      refetch();
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
      alert("Erro ao marcar como pago. Tente novamente.");
    }
  };

  const modalTitle = editingGuarderiaId ? "Editar Guarderia" : "Nova Guarderia";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Guarderia</h1>
        <Button onClick={handleNew}>Nova Guarderia</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por aluno ou tipo..."
      />

      <GuarderiaList
        guarderias={filteredGuarderias}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarcarPago={handleMarcarPago}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="md"
      >
        <GuarderiaForm
          guarderiaId={editingGuarderiaId}
          onSuccess={handleSuccess}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

