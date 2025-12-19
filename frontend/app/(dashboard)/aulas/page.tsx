"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AulaCalendar } from "@/components/aulas/AulaCalendar";
import { useAulas } from "@/hooks/useAulas";
import { deleteAula, quitarAula, getAula } from "@/lib/api/aula";
import { Modal } from "@/components/ui/Modal";
import { AulaForm } from "@/components/aulas/AulaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { AulaResponse } from "@/types/aula";
import { ApiError } from "@/lib/api/client";


export default function AulasPage() {
    const { aulas, isLoading, error, refetch } = useAulas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAulaId, setEditingAulaId] = useState<number | undefined>(undefined);
    const [editingAula, setEditingAula] = useState<AulaResponse | undefined>(undefined);
    const [isLoadingAula, setIsLoadingAula] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [aulaToDelete, setAulaToDelete] = useState<number | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const filteredAulas = useMemo(() => {
        return filterBySearch(aulas, searchTerm, ["nomeAluno"]);
    }, [aulas, searchTerm]);

    // Buscar aula quando editingAulaId mudar
    useEffect(() => {
        if (editingAulaId) {
            setIsLoadingAula(true);
            getAula(editingAulaId)
                .then((aula) => {
                    setEditingAula(aula);
                    setIsLoadingAula(false);
                })
                .catch((err) => {
                    console.error("Erro ao carregar aula:", err);
                    setIsLoadingAula(false);
                    alert("Erro ao carregar dados da aula");
                });
        } else {
            setEditingAula(undefined);
        }
    }, [editingAulaId]);

    const handleNew = () => {
        setEditingAulaId(undefined);
        setEditingAula(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditingAulaId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAulaId(undefined);
        setEditingAula(undefined);
    };

    const handleSuccess = () => {
        handleCloseModal();
        refetch();
    };

    const handleDeleteClick = (id: number) => {
        setAulaToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (aulaToDelete === null) return;
        
        try {
            await deleteAula(aulaToDelete);
            setIsDeleteModalOpen(false);
            setAulaToDelete(null);
            refetch();
        } catch (e) {
            setIsDeleteModalOpen(false);
            if (e instanceof ApiError && e.status === 409) {
                setErrorMessage(e.message || "Não é possível excluir esta aula.");
                setIsErrorModalOpen(true);
            } else {
                setErrorMessage("Erro ao excluir aula. Tente novamente.");
                setIsErrorModalOpen(true);
            }
            setAulaToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAulaToDelete(null);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage("");
    };

    const handlePay = async (id: number) => {
        try {
            await quitarAula(id);
            refetch();
        } catch (e) {
            alert("Erro ao confirmar pagamento");
        }
    };

    const modalTitle = editingAulaId ? "Editar Aula" : "Nova Aula";

    return (
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
        <Button onClick={handleNew}>Nova Aula</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome do aluno..."
      />

      <AulaCalendar
        aulas={filteredAulas}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={handleDeleteClick}
        onPay={handlePay}
        onEdit={handleEdit}
      />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                size="lg"
            >
                {isLoadingAula ? (
                    <div className="text-center py-8">Carregando dados da aula...</div>
                ) : (
                    <AulaForm
                        initialData={editingAula ? {
                            id: editingAula.id,
                            alunoId: editingAula.alunoId,
                            data: editingAula.data,
                            horaInicio: editingAula.horaInicio,
                            horaFim: editingAula.horaFim,
                            tipoAulaId: editingAula.tipoAulaId,
                            valor: editingAula.valor,
                            statusPagamento: editingAula.statusPagamento,
                        } : undefined}
                        onSuccess={handleSuccess}
                        onClose={handleCloseModal}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Confirmar Exclusão"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCloseDeleteModal}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleConfirmDelete}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isErrorModalOpen}
                onClose={handleCloseErrorModal}
                title="Erro ao Excluir Aula"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {errorMessage}
                    </p>
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            onClick={handleCloseErrorModal}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
