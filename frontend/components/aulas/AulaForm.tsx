"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Button } from "@/components/ui/Button";
import { AulaCreateRequest, StatusPagamento } from "@/types/aula";
import { createAula, updateAula } from "@/lib/api/aula";
import { useAlunos } from "@/hooks/useAlunos";
import { useTipoAulas } from "@/hooks/useTipoAulas";

interface AulaFormProps {
    initialData?: AulaCreateRequest & { id?: number };
    onSuccess?: () => void;
    onClose?: () => void;
}

export function AulaForm({ initialData, onSuccess, onClose }: AulaFormProps) {
    const router = useRouter();
    const { alunos } = useAlunos();
    const { tipoAulas } = useTipoAulas();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isInitialMount = useRef(true);
    const lastTipoAulaId = useRef<number>(0);

    const [formData, setFormData] = useState<AulaCreateRequest>({
        alunoId: initialData?.alunoId || 0,
        data: initialData?.data || new Date().toISOString().split("T")[0],
        horaInicio: initialData?.horaInicio || "",
        horaFim: initialData?.horaFim || "",
        tipoAulaId: initialData?.tipoAulaId || 0,
        valor: initialData?.valor || 0,
        statusPagamento: initialData?.statusPagamento || "PENDENTE",
    });

    // Reset form quando initialData mudar
    useEffect(() => {
        if (!initialData) {
            setFormData({
                alunoId: 0,
                data: new Date().toISOString().split("T")[0],
                horaInicio: "",
                horaFim: "",
                tipoAulaId: 0,
                valor: 0,
                statusPagamento: "PENDENTE",
            });
            setError(null);
            lastTipoAulaId.current = 0;
        } else {
            setFormData({
                alunoId: initialData.alunoId,
                data: initialData.data,
                horaInicio: initialData.horaInicio,
                horaFim: initialData.horaFim,
                tipoAulaId: initialData.tipoAulaId,
                valor: initialData.valor,
                statusPagamento: initialData.statusPagamento,
            });
            lastTipoAulaId.current = initialData.tipoAulaId;
        }
        isInitialMount.current = false;
    }, [initialData]);

    // Auto-fill Hora Fim logic (1h duration)
    useEffect(() => {
        if (formData.horaInicio && !initialData?.horaFim) { // Only auto-fill if not editing an existing horaFim
            const [hours, minutes] = formData.horaInicio.split(":").map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setHours(date.getHours() + 1);

            const newHours = date.getHours().toString().padStart(2, "0");
            const newMinutes = date.getMinutes().toString().padStart(2, "0");

            setFormData((prev) => ({ ...prev, horaFim: `${newHours}:${newMinutes}` }));
        }
    }, [formData.horaInicio, initialData?.horaFim]);

    // Auto-fill Valor when Tipo de Aula is selected
    useEffect(() => {
        // Skip on initial mount to avoid overwriting initialData
        if (isInitialMount.current) {
            return;
        }

        // Only auto-fill when tipoAulaId changes and is valid
        if (formData.tipoAulaId > 0 && tipoAulas.length > 0 && formData.tipoAulaId !== lastTipoAulaId.current) {
            const tipoAulaSelecionado = tipoAulas.find((tipo) => tipo.id === formData.tipoAulaId);
            if (tipoAulaSelecionado && tipoAulaSelecionado.valorPadrao) {
                setFormData((prev) => ({ ...prev, valor: tipoAulaSelecionado.valorPadrao }));
                lastTipoAulaId.current = formData.tipoAulaId;
            }
        }
    }, [formData.tipoAulaId, tipoAulas]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (formData.alunoId === 0) {
            setError("Selecione um aluno");
            setIsSubmitting(false);
            return;
        }

        if (formData.tipoAulaId === 0) {
            setError("Selecione um tipo de aula");
            setIsSubmitting(false);
            return;
        }

        try {
            if (initialData?.id) {
                await updateAula(initialData.id, formData);
            } else {
                await createAula(formData);
            }

            if (onClose) {
                onClose();
            }
            if (onSuccess) {
                onSuccess();
            } else if (!onClose) {
                router.push("/aulas");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar aula");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <Select
                label="Aluno *"
                required
                value={formData.alunoId > 0 ? formData.alunoId.toString() : ""}
                onChange={(e) => setFormData({ ...formData, alunoId: Number(e.target.value) })}
            >
                <option value="">Selecione um aluno...</option>
                {alunos.map((aluno: any) => (
                    // Assuming AlunoFindAllResponse has id, if not we might need to adjust useAlunos or AlunoResponse
                    <option key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                    </option>
                ))}
            </Select>

            <Input
                label="Data *"
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <TimeSelect
                    label="Hora Início *"
                    required
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                />
                <TimeSelect
                    label="Hora Fim *"
                    required
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                />
            </div>

            <Select
                label="Tipo de Aula *"
                required
                value={formData.tipoAulaId > 0 ? formData.tipoAulaId.toString() : ""}
                onChange={(e) => setFormData({ ...formData, tipoAulaId: Number(e.target.value) })}
            >
                <option value="">Selecione um tipo de aula...</option>
                {tipoAulas.map((tipoAula) => (
                    <option key={tipoAula.id} value={tipoAula.id}>
                        {tipoAula.nome}
                    </option>
                ))}
            </Select>

            <Input
                label="Valor (R$) *"
                type="number"
                step="0.01"
                required
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
            />

            <Select
                label="Status Pagamento *"
                required
                value={formData.statusPagamento}
                onChange={(e) => setFormData({ ...formData, statusPagamento: e.target.value as StatusPagamento })}
            >
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
            </Select>

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
