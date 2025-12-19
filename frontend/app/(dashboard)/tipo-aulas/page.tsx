"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { TipoAulaTable } from "@/components/tipoAulas/TipoAulaTable";
import { useTipoAulas } from "@/hooks/useTipoAulas";
import { Modal } from "@/components/ui/Modal";
import { TipoAulaForm } from "@/components/tipoAulas/TipoAulaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";
import { deleteTipoAula } from "@/lib/api/tipoAula";
import { ApiError } from "@/lib/api/client";

export default function TipoAulasPage() {
    const { tipoAulas, isLoading, error, refetch } = useTipoAulas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTipoAulaId, setEditingTipoAulaId] = useState<number | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tipoAulaToDelete, setTipoAulaToDelete] = useState<number | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const filteredTipoAulas = useMemo(() => {
        return filterBySearch(tipoAulas, searchTerm, ["nome"]);
    }, [tipoAulas, searchTerm]);

    const handleNew = () => {
        setEditingTipoAulaId(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setEditingTipoAulaId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTipoAulaId(undefined);
    };

    const handleSuccess = () => {
        handleCloseModal();
        refetch();
    };

    const handleDeleteClick = (id: number) => {
        setTipoAulaToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (tipoAulaToDelete === null) return;
        
        try {
            await deleteTipoAula(tipoAulaToDelete);
            setIsDeleteModalOpen(false);
            setTipoAulaToDelete(null);
            refetch();
        } catch (e) {
            setIsDeleteModalOpen(false);
            if (e instanceof ApiError && e.status === 409) {
                setErrorMessage(e.message || "Não é possível excluir este tipo de aula pois ele está relacionado a aulas.");
                setIsErrorModalOpen(true);
            } else {
                setErrorMessage("Erro ao excluir tipo de aula. Tente novamente.");
                setIsErrorModalOpen(true);
            }
            setTipoAulaToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTipoAulaToDelete(null);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage("");
    };

    const modalTitle = editingTipoAulaId ? "Editar Tipo de Aula" : "Novo Tipo de Aula";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Tipos de Aula</h1>
                <Button onClick={handleNew}>Novo Tipo de Aula</Button>
            </div>

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Pesquisar por nome..."
            />

            <TipoAulaTable
                tipoAulas={filteredTipoAulas}
                isLoading={isLoading}
                error={error || undefined}
                onRetry={refetch}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                size="lg"
            >
                <TipoAulaForm
                    tipoAulaId={editingTipoAulaId}
                    onSuccess={handleSuccess}
                    onClose={handleCloseModal}
                />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Confirmar Exclusão"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Tem certeza que deseja excluir este tipo de aula? Esta ação não pode ser desfeita.
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
                title="Erro ao Excluir Tipo de Aula"
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

