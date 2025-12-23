"use client";

import { useState, useEffect } from "react";
import { getGuarderias, deleteGuarderia } from "@/lib/api/guarderia";
import { GuarderiaResponse } from "@/types/guarderia";

export function useGuarderia() {
    const [guarderias, setGuarderias] = useState<GuarderiaResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGuarderias = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getGuarderias();
            setGuarderias(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar guarderias");
        } finally {
            setIsLoading(false);
        }
    };

    const excluirGuarderia = async (id: number) => {
        try {
            await deleteGuarderia(id);
            await fetchGuarderias();
        } catch (err) {
            console.error("Erro ao excluir guarderia", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchGuarderias();
    }, []);

    return {
        guarderias,
        isLoading,
        error,
        refetch: fetchGuarderias,
        excluirGuarderia,
    };
}

