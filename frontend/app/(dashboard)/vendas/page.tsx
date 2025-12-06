"use client";

import { useVendas } from "@/hooks/useVendas";
import { StatusPagamento } from "@/types/venda";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function VendasPage() {
  const { vendas, loading, quitarVenda } = useVendas();

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Link href="/vendas/novo">
          <Button>Nova Venda</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(venda.dataVenda).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venda.nomeProduto} ({venda.quantidade})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {venda.nomeComprador || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {venda.valorTotal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      venda.statusPagamento === StatusPagamento.PAGO
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {venda.statusPagamento}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {venda.statusPagamento === StatusPagamento.PENDENTE && (
                    <button
                      onClick={() => {
                        if (confirm("Confirmar pagamento desta venda?")) {
                          quitarVenda(venda.id);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Quitar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
