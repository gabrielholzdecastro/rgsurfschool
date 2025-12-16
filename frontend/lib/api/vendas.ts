import { VendaCreateRequest, VendaResponse } from "@/types/venda";
import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export const vendaApi = {
  listarVendas: async (): Promise<VendaResponse[]> => {
    return await apiGet<VendaResponse[]>("/vendas");
  },

  realizarVenda: async (venda: VendaCreateRequest): Promise<VendaResponse> => {
    return await apiPost<VendaResponse>("/vendas", venda);
  },

  atualizarVenda: async (
    id: number,
    venda: VendaCreateRequest
  ): Promise<VendaResponse> => {
    return await apiPut<VendaResponse>(`/vendas/${id}`, venda);
  },

  excluirVenda: async (id: number): Promise<void> => {
    await apiDelete(`/vendas/${id}`);
  },

  quitarVenda: async (id: number): Promise<void> => {
    await apiPut<void>(`/vendas/${id}/quitar`, {});
  }
};
