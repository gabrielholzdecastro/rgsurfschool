"use client";

import { AulaResponse } from "@/types/aula";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { formatDate } from "@/lib/utils";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

import Link from "next/link";

interface AulaListProps {
    aulas: AulaResponse[];
    isLoading?: boolean;
    error?: string;
    onRetry?: () => void;
    onDelete?: (id: number) => void;
    onPay?: (id: number) => void;
}

export function AulaList({
    aulas,
    isLoading,
    error,
    onRetry,
    onDelete,
    onPay,
}: AulaListProps) {
    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    if (aulas.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma aula agendada.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Aluno</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Horário</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aulas.map((aula) => (
                            <tr key={aula.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {aula.nomeAluno}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(aula.data)}
                                </td>
                                <td className="px-6 py-4">
                                    {aula.horaInicio} - {aula.horaFim}
                                </td>
                                <td className="px-6 py-4">
                                    {aula.tipoAula === "KITE_SURF" ? "Kite Surf" : "Surfe"}
                                </td>
                                <td className="px-6 py-4">
                                    R$ {aula.valor.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${aula.statusPagamento === "PAGO"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {aula.statusPagamento}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                    {(onDelete || onPay) && (
                                        <>
                                            {onPay && aula.statusPagamento === "PENDENTE" && (
                                                <Button
                                                    variant="outline"
                                                    className="text-green-600 border-green-600 hover:bg-green-50 p-1.5"
                                                    title="Quitar"
                                                    onClick={() => onPay(aula.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <Link href={`/aulas/${aula.id}`}>
                                                <Button variant="secondary" className="p-1.5" title="Editar">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            {onDelete && (
                                                <Button
                                                    variant="danger"
                                                    className="text-white p-1.5"
                                                    title="Excluir"
                                                    onClick={() => onDelete(aula.id)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </>
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
