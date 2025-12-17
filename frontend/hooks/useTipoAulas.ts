"use client";

import { useState, useEffect } from "react";
import { getTipoAulas } from "@/lib/api/tipoAula";
import { TipoAulaResponse } from "@/types/tipoAula";

export function useTipoAulas() {
    const [tipoAulas, setTipoAulas] = useState<TipoAulaResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipoAulas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTipoAulas();
            setTipoAulas(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar tipos de aula");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTipoAulas();
    }, []);

    return {
        tipoAulas,
        isLoading,
        error,
        refetch: fetchTipoAulas,
    };
}

