"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProdutoTable } from "@/components/produtos/ProdutoTable";
import { useProduto } from "@/hooks/useProduto";
import { Modal } from "@/components/ui/Modal";
import { ProdutoForm } from "@/components/produtos/ProdutoForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { deleteProduto } from "@/lib/api/produto";
import { ApiError } from "@/lib/api/client";

export default function ProdutosPage() {
  const { produtos, isLoading, error, refetch } = useProduto();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProdutoId, setEditingProdutoId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const filteredProdutos = useMemo(() => {
    return filterBySearch(produtos, searchTerm, ["nome", "fornecedor"]);
  }, [produtos, searchTerm]);

  const handleNew = () => {
    setEditingProdutoId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setEditingProdutoId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProdutoId(undefined);
  };

  const handleSuccess = () => {
    handleCloseModal();
    refetch();
  };

  const handleDeleteClick = (id: number) => {
    setProdutoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (produtoToDelete === null) return;
    
    try {
      await deleteProduto(produtoToDelete);
      setIsDeleteModalOpen(false);
      setProdutoToDelete(null);
      refetch();
    } catch (e) {
      setIsDeleteModalOpen(false);
      if (e instanceof ApiError && e.status === 409) {
        setErrorMessage(e.message || "Não é possível excluir este produto pois ele está relacionado a vendas.");
        setIsErrorModalOpen(true);
      } else {
        setErrorMessage("Erro ao excluir produto. Tente novamente.");
        setIsErrorModalOpen(true);
      }
      setProdutoToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProdutoToDelete(null);
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  const modalTitle = editingProdutoId ? "Editar Produto" : "Novo Produto";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <Button onClick={handleNew}>Novo Produto</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome ou fornecedor..."
      />

      <ProdutoTable
        produtos={filteredProdutos}
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
        size="lg"
      >
        <ProdutoForm
          produtoId={editingProdutoId}
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
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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
        title="Erro ao Excluir Produto"
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

