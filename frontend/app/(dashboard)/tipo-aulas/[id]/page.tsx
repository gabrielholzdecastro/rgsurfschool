"use client";

import { useParams } from "next/navigation";
import { TipoAulaForm } from "@/components/tipoAulas/TipoAulaForm";

export default function EditarTipoAulaPage() {
    const params = useParams();
    const id = params.id ? parseInt(params.id as string) : undefined;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Editar Tipo de Aula</h1>
            <div className="max-w-2xl">
                {id ? <TipoAulaForm tipoAulaId={id} /> : <p>Tipo de aula não encontrado</p>}
            </div>
        </div>
    );
}

