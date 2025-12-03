"use client";

import { useState, useEffect } from "react";
import { getLojas } from "@/lib/api/loja";
import { LojaResponse } from "@/types/loja";

export function useLoja() {
  const [produtos, setProdutos] = useState<LojaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLojas();
      setProdutos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return {
    produtos,
    isLoading,
    error,
    refetch: fetchProdutos,
  };
}

