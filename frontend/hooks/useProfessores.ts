"use client";

import { useEffect, useState } from "react";
import { ProfessorResponse } from "@/types/professor";
import { getProfessores } from "@/lib/api/professores";

export function useProfessores() {
  const [professores, setProfessores] = useState<ProfessorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfessores();
      setProfessores(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar professores"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  return {
    professores,
    isLoading,
    error,
    refetch: fetchProfessores,
  };
}
