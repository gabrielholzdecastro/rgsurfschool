import { VendaCreateRequest, VendaResponse } from "@/types/venda";
import { apiGet, apiPost, apiPut } from "./client";

export const vendaApi = {
  listarVendas: async (): Promise<VendaResponse[]> => {
    return await apiGet<VendaResponse[]>("/vendas");
  },

  realizarVenda: async (venda: VendaCreateRequest): Promise<VendaResponse> => {
    return await apiPost<VendaResponse>("/vendas", venda);
  },

  quitarVenda: async (id: number): Promise<void> => {
    await apiPut<void>(`/vendas/${id}/quitar`, {});
  }
};
