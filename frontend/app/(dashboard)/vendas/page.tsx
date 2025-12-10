"use client";

import { useVendas } from "@/hooks/useVendas";
import { VendaList } from "@/components/vendas/VendaList";
import { StatusPagamento } from "@/types/venda";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function VendasPage() {
  const { vendas, loading, quitarVenda } = useVendas();

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Link href="/vendas/novo">
          <Button>Nova Venda</Button>
        </Link>
      </div>

      <VendaList vendas={vendas} quitarVenda={quitarVenda} />
    </div>
  );
}
