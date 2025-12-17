"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProdutoTable } from "@/components/produtos/ProdutoTable";
import { useProduto } from "@/hooks/useProduto";

export default function ProdutosPage() {
  const { produtos, isLoading, error, refetch } = useProduto();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <Link href="/produtos/novo">
          <Button>Novo Produto</Button>
        </Link>
      </div>

      <ProdutoTable
        produtos={produtos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />
    </div>
  );
}

