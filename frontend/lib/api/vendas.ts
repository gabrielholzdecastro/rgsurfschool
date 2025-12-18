import { VendaCreateRequest, VendaResponse } from "@/types/venda";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export const vendaApi = {
  listarVendas: async (): Promise<VendaResponse[]> => {
    return await apiGet<VendaResponse[]>("/api/vendas");
  },

  buscarVenda: async (id: number): Promise<VendaResponse> => {
    return await apiGet<VendaResponse>(`/api/vendas/${id}`);
  },

  realizarVenda: async (venda: VendaCreateRequest): Promise<VendaResponse> => {
    return await apiPost<VendaResponse>("/api/vendas", venda);
  },

  atualizarVenda: async (
    id: number,
    venda: VendaCreateRequest
  ): Promise<VendaResponse> => {
    return await apiPut<VendaResponse>(`/api/vendas/${id}`, venda);
  },

  excluirVenda: async (id: number): Promise<void> => {
    await apiDelete(`/api/vendas/${id}`);
  },

  quitarVenda: async (id: number): Promise<void> => {
    await apiPut<void>(`/api/vendas/${id}/quitar`, {});
  }
};
