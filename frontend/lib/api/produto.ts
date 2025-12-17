import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { ProdutoRequest, ProdutoResponse } from "@/types/produto";

export async function getProdutos(): Promise<ProdutoResponse[]> {
  return apiGet<ProdutoResponse[]>("/api/produtos");
}

export async function createProduto(data: ProdutoRequest): Promise<ProdutoResponse> {
  return apiPost<ProdutoResponse>("/api/produtos", data);
}

export async function updateProduto(
  id: number,
  data: ProdutoRequest
): Promise<ProdutoResponse> {
  return apiPut<ProdutoResponse>(`/api/produtos/${id}`, data);
}

export async function deleteProduto(id: number): Promise<void> {
  return apiDelete(`/api/produtos/${id}`);
}

