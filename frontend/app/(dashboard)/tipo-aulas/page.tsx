"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { TipoAulaTable } from "@/components/tipoAulas/TipoAulaTable";
import { useTipoAulas } from "@/hooks/useTipoAulas";
import { Modal } from "@/components/ui/Modal";
import { TipoAulaForm } from "@/components/tipoAulas/TipoAulaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";

export default function TipoAulasPage() {
    const { tipoAulas, isLoading, error, refetch } = useTipoAulas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTipoAulaId, setEditingTipoAulaId] = useState<number | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");

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
                onDelete={refetch}
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
        </div>
    );
}

