"use client";

import { use, useEffect, useState } from "react";
import { AulaForm } from "@/components/aulas/AulaForm";
import { getAula } from "@/lib/api/aula"; // I need to make sure getAula is exported in lib/api/aula.ts
import { AulaResponse } from "@/types/aula";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface EditAulaPageProps {
    params: Promise<{ id: string }>;
}

export default function EditAulaPage({ params }: EditAulaPageProps) {
    const { id } = use(params);
    const [aula, setAula] = useState<AulaResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAula() {
            try {
                const data = await getAula(Number(id));
                setAula(data);
            } catch (err) {
                setError("Erro ao carregar aula");
            } finally {
                setIsLoading(false);
            }
        }

        fetchAula();
    }, [id]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;
    if (!aula) return <ErrorMessage message="Aula não encontrada" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
            <div className="max-w-2xl">
                <AulaForm
                    initialData={{
                        id: aula.id,
                        alunoId: aula.alunoId,
                        data: aula.data,
                        horaInicio: aula.horaInicio,
                        horaFim: aula.horaFim,
                        tipoAulaId: aula.tipoAulaId,
                        valor: aula.valor,
                        statusPagamento: aula.statusPagamento,
                    }}
                />
            </div>
        </div>
    );
}
// Wait, I need to check AulaResponse definition. If it lacks alunoId, I am stuck.
// Checking Types/aula.ts
