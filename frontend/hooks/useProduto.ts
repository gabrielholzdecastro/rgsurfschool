"use client";

import { useState, useEffect } from "react";
import { getProdutos } from "@/lib/api/produto";
import { ProdutoResponse } from "@/types/produto";

export function useProduto() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProdutos();
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

