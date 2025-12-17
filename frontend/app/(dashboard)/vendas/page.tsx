"use client";

import { useState } from "react";
import { useVendas } from "@/hooks/useVendas";
import { VendaList } from "@/components/vendas/VendaList";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { VendaForm } from "@/components/vendas/VendaForm";

export default function VendasPage() {
  const { vendas, loading, error, recarregar, excluirVenda, quitarVenda } = useVendas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Venda</Button>
      </div>

      <VendaList 
        vendas={vendas} 
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
