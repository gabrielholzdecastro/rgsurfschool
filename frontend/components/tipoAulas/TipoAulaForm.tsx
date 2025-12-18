"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TipoAulaCreateRequest, TipoAulaUpdateRequest } from "@/types/tipoAula";
import { createTipoAula, updateTipoAula, getTipoAula } from "@/lib/api/tipoAula";

interface TipoAulaFormProps {
    tipoAulaId?: number;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function TipoAulaForm({ tipoAulaId, onSuccess, onClose }: TipoAulaFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(!!tipoAulaId);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<TipoAulaCreateRequest>({
        nome: "",
        valorPadrao: 0,
    });

    const loadTipoAula = useCallback(async () => {
        if (!tipoAulaId) return;

        try {
            const tipoAula = await getTipoAula(tipoAulaId);
            setFormData({
                nome: tipoAula.nome,
                valorPadrao: tipoAula.valorPadrao,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar tipo de aula");
        } finally {
            setIsLoading(false);
        }
    }, [tipoAulaId]);

    useEffect(() => {
        if (tipoAulaId) {
            loadTipoAula();
        } else {
            // Reset form quando não há tipoAulaId (modo criação)
            setFormData({
                nome: "",
                valorPadrao: 0,
            });
            setIsLoading(false);
            setError(null);
        }
    }, [tipoAulaId, loadTipoAula]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (tipoAulaId) {
                const updateRequest: TipoAulaUpdateRequest = {
                    nome: formData.nome,
                    valorPadrao: formData.valorPadrao,
                };
                await updateTipoAula(tipoAulaId, updateRequest);
            } else {
                await createTipoAula(formData);
            }
            if (onClose) {
                onClose();
            }
            if (onSuccess) {
                onSuccess();
            } else if (!onClose) {
                router.push("/tipo-aulas");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar tipo de aula");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <Input
                label="Nome *"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />

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

