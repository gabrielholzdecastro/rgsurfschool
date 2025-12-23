"use client";

import { useRouter } from "next/navigation";
import { GuarderiaForm } from "@/components/guarderia/GuarderiaForm";

export default function NovaGuarderiaPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Guarderia</h1>
      <GuarderiaForm
        onSuccess={() => router.push("/guarderia")}
        onClose={() => router.back()}
      />
    </div>
  );
}

