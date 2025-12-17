"use client";

import { ProdutoForm } from "@/components/produtos/ProdutoForm";

export default function NovoProdutoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
      <div className="max-w-2xl">
        <ProdutoForm />
      </div>
    </div>
  );
}

