"use client";

import { useState, useEffect } from "react";
import { getTipoGuarderias } from "@/lib/api/tipoGuarderia";
import { TipoGuarderiaResponse } from "@/types/tipoGuarderia";

export function useTipoGuarderia() {
    const [tipoGuarderias, setTipoGuarderias] = useState<TipoGuarderiaResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipoGuarderias = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTipoGuarderias();
            setTipoGuarderias(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar tipos de guarderia");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTipoGuarderias();
    }, []);

    return {
        tipoGuarderias,
        isLoading,
        error,
        refetch: fetchTipoGuarderias,
    };
}

