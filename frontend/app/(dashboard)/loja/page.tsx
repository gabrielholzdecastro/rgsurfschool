"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LojaTable } from "@/components/loja/LojaTable";
import { useLoja } from "@/hooks/useLoja";

export default function LojaPage() {
  const { produtos, isLoading, error, refetch } = useLoja();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Lojinha</h1>
        <Link href="/loja/novo">
          <Button>Novo Item</Button>
        </Link>
      </div>

      <LojaTable
        produtos={produtos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />
    </div>
  );
}
