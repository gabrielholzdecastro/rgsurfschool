"use client";

import { useState, useEffect } from "react";
import { getAulas } from "@/lib/api/aula";
import { AulaResponse } from "@/types/aula";

export function useAulas() {
    const [aulas, setAulas] = useState<AulaResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAulas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAulas();
            setAulas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar aulas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAulas();
    }, []);

    return {
        aulas,
        isLoading,
        error,
        refetch: fetchAulas,
    };
}
