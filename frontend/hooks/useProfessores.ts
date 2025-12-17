"use client";

import { useState, useEffect } from "react";
import { getProfessores } from "@/lib/api/professor";
import { ProfessorResponse } from "@/types/professor";

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

