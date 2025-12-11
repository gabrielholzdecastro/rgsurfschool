"use client";

import { LojaForm } from "@/components/loja/LojaForm";

export default function NovoProdutoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Novo Item</h1>
      <div className="max-w-2xl">
        <LojaForm />
      </div>
    </div>
  );
}
