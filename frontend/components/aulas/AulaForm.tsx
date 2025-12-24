"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AulaCreateRequest, StatusPagamento } from "@/types/aula";
import { createAula, updateAula } from "@/lib/api/aula";
import { useAlunos } from "@/hooks/useAlunos";
import { useTipoAulas } from "@/hooks/useTipoAulas";
import { useProfessores } from "@/hooks/useProfessores";
import { TipoAulaTable } from "@/components/tipoAulas/TipoAulaTable";
import { TipoAulaForm } from "@/components/tipoAulas/TipoAulaForm";
import { deleteTipoAula } from "@/lib/api/tipoAula";
import { ApiError } from "@/lib/api/client";
import { Settings } from "lucide-react";

interface AulaFormProps {
    initialData?: AulaCreateRequest & { id?: number };
    onSuccess?: () => void;
    onClose?: () => void;
}

export function AulaForm({ initialData, onSuccess, onClose }: AulaFormProps) {
    const router = useRouter();
    const { alunos } = useAlunos();
    const { tipoAulas, isLoading: loadingServicos, refetch: refetchServicos } = useTipoAulas();
    const { professores } = useProfessores();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isInitialMount = useRef(true);
    const lastTipoAulaId = useRef<number>(0);
    const [isServicosModalOpen, setIsServicosModalOpen] = useState(false);
    const [isEditServicoModalOpen, setIsEditServicoModalOpen] = useState(false);
    const [editingServicoId, setEditingServicoId] = useState<number | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState<number | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [formData, setFormData] = useState<AulaCreateRequest>({
        alunoId: initialData?.alunoId || 0,
        data: initialData?.data || new Date().toISOString().split("T")[0],
        horaInicio: initialData?.horaInicio || "",
        horaFim: initialData?.horaFim || "",
        tipoAulaId: initialData?.tipoAulaId || 0,
        professorId: initialData?.professorId,
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
                professorId: undefined,
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
                professorId: initialData.professorId,
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
        <>
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

            <Select
                label="Professor"
                value={formData.professorId ? formData.professorId.toString() : ""}
                onChange={(e) => setFormData({ ...formData, professorId: e.target.value ? Number(e.target.value) : undefined })}
            >
                <option value="">Selecione um professor...</option>
                {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                        {professor.nome}
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço *
                </label>
                <div className="flex gap-2">
                    <Select
                        required
                        value={formData.tipoAulaId > 0 ? formData.tipoAulaId.toString() : ""}
                        onChange={(e) => setFormData({ ...formData, tipoAulaId: Number(e.target.value) })}
                        className="flex-1"
                    >
                        <option value="">Selecione um serviço...</option>
                        {tipoAulas.map((tipoAula) => (
                            <option key={tipoAula.id} value={tipoAula.id}>
                                {tipoAula.nome}
                            </option>
                        ))}
                    </Select>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsServicosModalOpen(true)}
                        className="px-2 py-1 h-[37px] flex items-center justify-center"
                        title="Gerenciar serviços"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </div>

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

        {/* Modal de Gerenciamento de Serviços */}
        <Modal
            isOpen={isServicosModalOpen}
            onClose={() => setIsServicosModalOpen(false)}
            title="Gerenciar Serviços"
            size="lg"
        >
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button onClick={() => {
                        setEditingServicoId(undefined);
                        setIsEditServicoModalOpen(true);
                    }}>
                        Novo Serviço
                    </Button>
                </div>
                <TipoAulaTable
                    tipoAulas={tipoAulas}
                    isLoading={loadingServicos}
                    error={undefined}
                    onRetry={refetchServicos}
                    onEdit={(id) => {
                        setEditingServicoId(id);
                        setIsEditServicoModalOpen(true);
                    }}
                    onDelete={(id) => {
                        setServicoToDelete(id);
                        setIsDeleteModalOpen(true);
                    }}
                />
            </div>
        </Modal>

        {/* Modal de Edição/Criação de Serviço */}
        <Modal
            isOpen={isEditServicoModalOpen}
            onClose={() => {
                setIsEditServicoModalOpen(false);
                setEditingServicoId(undefined);
            }}
            title={editingServicoId ? "Editar Serviço" : "Novo Serviço"}
            size="lg"
        >
            <TipoAulaForm
                tipoAulaId={editingServicoId}
                onSuccess={() => {
                    setIsEditServicoModalOpen(false);
                    setEditingServicoId(undefined);
                    refetchServicos();
                }}
                onClose={() => {
                    setIsEditServicoModalOpen(false);
                    setEditingServicoId(undefined);
                }}
            />
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => {
                setIsDeleteModalOpen(false);
                setServicoToDelete(null);
            }}
            title="Confirmar Exclusão"
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-gray-700">
                    Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setServicoToDelete(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={async () => {
                            if (servicoToDelete === null) return;
                            
                            try {
                                await deleteTipoAula(servicoToDelete);
                                setIsDeleteModalOpen(false);
                                setServicoToDelete(null);
                                refetchServicos();
                            } catch (e) {
                                setIsDeleteModalOpen(false);
                                if (e instanceof ApiError && e.status === 409) {
                                    setErrorMessage(e.message || "Não é possível excluir este serviço pois ele está relacionado a aulas.");
                                } else {
                                    setErrorMessage("Erro ao excluir serviço. Tente novamente.");
                                }
                                setIsErrorModalOpen(true);
                                setServicoToDelete(null);
                            }
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </div>
        </Modal>

        {/* Modal de Erro */}
        <Modal
            isOpen={isErrorModalOpen}
            onClose={() => {
                setIsErrorModalOpen(false);
                setErrorMessage("");
            }}
            title="Erro ao Excluir Serviço"
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-gray-700">
                    {errorMessage}
                </p>
                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setIsErrorModalOpen(false);
                            setErrorMessage("");
                        }}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </Modal>
    </>
    );
}
