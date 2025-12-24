"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TipoGuarderiaUpdateRequest, TipoGuarderiaResponse, TempoGuarderia } from "@/types/tipoGuarderia";
import { updateTipoGuarderia, getTipoGuarderia } from "@/lib/api/tipoGuarderia";

interface TipoGuarderiaFormProps {
    tipoGuarderiaId: number;
    onSuccess?: () => void;
    onClose?: () => void;
}

function formatTipoGuarderia(tipo: TempoGuarderia): string {
    const tipoMap: Record<TempoGuarderia, string> = {
        [TempoGuarderia.DIARIA]: "Diária",
        [TempoGuarderia.MENSAL]: "Mensal",
        [TempoGuarderia.TRIMESTRAL]: "Trimestral",
        [TempoGuarderia.ANUAL]: "Anual",
    };
    return tipoMap[tipo] || tipo;
}

export function TipoGuarderiaForm({ tipoGuarderiaId, onSuccess, onClose }: TipoGuarderiaFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tipoGuarderia, setTipoGuarderia] = useState<TipoGuarderiaResponse | null>(null);

    const [formData, setFormData] = useState({
        valorPadrao: 0,
    });

    const loadTipoGuarderia = useCallback(async () => {
        try {
            const data = await getTipoGuarderia(tipoGuarderiaId);
            setTipoGuarderia(data);
            setFormData({
                valorPadrao: data.valorPadrao,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar tipo de guarderia");
        } finally {
            setIsLoading(false);
        }
    }, [tipoGuarderiaId]);

    useEffect(() => {
        loadTipoGuarderia();
    }, [loadTipoGuarderia]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const updateRequest: TipoGuarderiaUpdateRequest = {
                valorPadrao: formData.valorPadrao,
            };
            await updateTipoGuarderia(tipoGuarderiaId, updateRequest);
            if (onClose) {
                onClose();
            }
            if (onSuccess) {
                onSuccess();
            } else if (!onClose) {
                router.push("/tipo-guarderia");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar tipo de guarderia");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    if (!tipoGuarderia) {
        return <div className="text-center py-8 text-red-600">Tipo de guarderia não encontrado</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    {formatTipoGuarderia(tipoGuarderia.tipo)}
                </div>
            </div>

            <Input
                label="Valor Padrão (R$) *"
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.valorPadrao}
                onChange={(e) =>
                    setFormData({ ...formData, valorPadrao: parseFloat(e.target.value) || 0 })
                }
            />

            <div className="flex justify-end gap-3 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (onClose) {
                            onClose();
                        } else {
                            router.back();
                        }
                    }}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Salvar
                </Button>
            </div>
        </form>
    );
}

