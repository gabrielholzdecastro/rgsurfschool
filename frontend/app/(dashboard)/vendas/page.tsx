"use client";

import { useState, useMemo } from "react";
import { useVendas } from "@/hooks/useVendas";
import { VendaList } from "@/components/vendas/VendaList";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { VendaForm } from "@/components/vendas/VendaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { vendaApi } from "@/lib/api/vendas";
import { ApiError } from "@/lib/api/client";

export default function VendasPage() {
  const { vendas, loading, error, recarregar, excluirVenda, quitarVenda } = useVendas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendaId, setEditingVendaId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendaToDelete, setVendaToDelete] = useState<number | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const filteredVendas = useMemo(() => {
    return filterBySearch(vendas, searchTerm, ["nomeProduto", "nomeComprador"]);
  }, [vendas, searchTerm]);

  const handleNew = () => {
    setEditingVendaId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingVendaId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVendaId(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    recarregar();
  };

  const handleDeleteClick = (id: number) => {
    setVendaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (vendaToDelete === null) return;
    
    try {
      await vendaApi.excluirVenda(vendaToDelete);
      setIsDeleteModalOpen(false);
      setVendaToDelete(null);
      recarregar();
    } catch (e) {
      setIsDeleteModalOpen(false);
      if (e instanceof ApiError && e.status === 409) {
        setErrorMessage(e.message || "Não é possível excluir esta venda.");
        setIsErrorModalOpen(true);
      } else {
        setErrorMessage("Erro ao excluir venda. Tente novamente.");
        setIsErrorModalOpen(true);
      }
      setVendaToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVendaToDelete(null);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  const modalTitle = editingVendaId ? "Editar Venda" : "Nova Venda";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <Button onClick={handleNew}>Nova Venda</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por produto ou comprador..."
      />

      <VendaList 
        vendas={filteredVendas} 
        isLoading={loading}
        error={error || undefined}
        onRetry={recarregar}
        onDelete={handleDeleteClick}
        quitarVenda={quitarVenda}
        onEdit={handleEdit}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="xl"
      >
        <VendaForm
          vendaId={editingVendaId}
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
            Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
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
        title="Erro ao Excluir Venda"
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
