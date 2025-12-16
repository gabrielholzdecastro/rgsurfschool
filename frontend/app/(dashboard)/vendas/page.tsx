"use client";

import { useVendas } from "@/hooks/useVendas";
import { VendaList } from "@/components/vendas/VendaList";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function VendasPage() {
  const { vendas, loading, error, recarregar, excluirVenda, quitarVenda } = useVendas();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <Link href="/vendas/novo">
          <Button>Nova Venda</Button>
        </Link>
      </div>

      <VendaList 
        vendas={vendas} 
        isLoading={loading}
        error={error || undefined}
        onRetry={recarregar}
        onDelete={excluirVenda}
        quitarVenda={quitarVenda} 
      />
    </div>
  );
}
