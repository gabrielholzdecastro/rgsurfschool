"use client";

import { useState, useMemo } from "react";
import { useVendas } from "@/hooks/useVendas";
import { VendaList } from "@/components/vendas/VendaList";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { VendaForm } from "@/components/vendas/VendaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";

export default function VendasPage() {
  const { vendas, loading, error, recarregar, excluirVenda, quitarVenda } = useVendas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendas = useMemo(() => {
    return filterBySearch(vendas, searchTerm, ["nomeProduto", "nomeComprador"]);
  }, [vendas, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Venda</Button>
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
        onDelete={excluirVenda}
        quitarVenda={quitarVenda} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Venda"
        size="xl"
      >
        <VendaForm
          onSuccess={() => {
            setIsModalOpen(false);
            recarregar();
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
