"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProdutoTable } from "@/components/produtos/ProdutoTable";
import { useProduto } from "@/hooks/useProduto";
import { Modal } from "@/components/ui/Modal";
import { ProdutoForm } from "@/components/produtos/ProdutoForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";

export default function ProdutosPage() {
  const { produtos, isLoading, error, refetch } = useProduto();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProdutos = useMemo(() => {
    return filterBySearch(produtos, searchTerm, ["nome", "fornecedor"]);
  }, [produtos, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Produto</Button>
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
        onDelete={refetch}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Produto"
        size="lg"
      >
        <ProdutoForm
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

