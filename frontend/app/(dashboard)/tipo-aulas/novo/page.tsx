"use client";

import { TipoAulaForm } from "@/components/tipoAulas/TipoAulaForm";

export default function NovoTipoAulaPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Novo Tipo de Aula</h1>
            <div className="max-w-2xl">
                <TipoAulaForm />
            </div>
        </div>
    );
}

