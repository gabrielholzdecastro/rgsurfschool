"use client";

import { useState, useEffect } from "react";
import { getAlunos } from "@/lib/api/alunos";
import { AlunoFindAllResponse } from "@/types/aluno";

export function useAlunos() {
  const [alunos, setAlunos] = useState<AlunoFindAllResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAlunos();
      setAlunos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar alunos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return {
    alunos,
    isLoading,
    error,
    refetch: fetchAlunos,
  };
}

