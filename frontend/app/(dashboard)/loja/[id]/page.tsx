"use client";

import { useParams } from "next/navigation";
import { LojaForm } from "@/components/loja/LojaForm";

export default function EditarProdutoPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
      <div className="max-w-2xl">
        {id ? <LojaForm produtoId={id} /> : <p>Produto não encontrado</p>}
      </div>
    </div>
  );
}

