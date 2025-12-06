import { useState, useEffect } from "react";
import { VendaResponse } from "@/types/venda";
import { vendaApi } from "@/lib/api/vendas";

export function useVendas() {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarVendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendaApi.listarVendas();
      setVendas(data);
    } catch (err) {
      setError("Erro ao carregar vendas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quitarVenda = async (id: number) => {
    try {
      await vendaApi.quitarVenda(id);
      await carregarVendas(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao quitar venda", err);
      throw err;
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  return { vendas, loading, error, recarregar: carregarVendas, quitarVenda };
}
