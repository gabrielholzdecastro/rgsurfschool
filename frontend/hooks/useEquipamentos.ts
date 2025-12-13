"use client";

import { useEffect, useState } from "react";
import { EquipamentoResponse } from "@/types/equipamento";
import { getEquipamentos } from "@/lib/api/equipamentos";

export function useEquipamentos() {
  const [equipamentos, setEquipamentos] = useState<EquipamentoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipamentos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEquipamentos();
      setEquipamentos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar equipamentos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  return {
    equipamentos,
    isLoading,
    error,
    refetch: fetchEquipamentos,
  };
}
