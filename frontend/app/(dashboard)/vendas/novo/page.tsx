"use client";

import { useRouter } from "next/navigation";
import { VendaForm } from "@/components/vendas/VendaForm";

export default function NovaVendaPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Venda</h1>
      <VendaForm
        onSuccess={() => router.push("/vendas")}
        onClose={() => router.back()}
      />
    </div>
  );
}
