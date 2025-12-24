"use client";

import { useState } from "react";
import { TipoGuarderiaTable } from "@/components/tipoGuarderia/TipoGuarderiaTable";
import { useTipoGuarderia } from "@/hooks/useTipoGuarderia";
import { Modal } from "@/components/ui/Modal";
import { TipoGuarderiaForm } from "@/components/tipoGuarderia/TipoGuarderiaForm";

export default function TipoGuarderiaPage() {
    const { tipoGuarderias, isLoading, error, refetch } = useTipoGuarderia();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTipoGuarderiaId, setEditingTipoGuarderiaId] = useState<number | undefined>(undefined);

    const handleEdit = (id: number) => {
        setEditingTipoGuarderiaId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTipoGuarderiaId(undefined);
    };

    const handleSuccess = () => {
        handleCloseModal();
        refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Tipos de Guarderia</h1>
            </div>

            <TipoGuarderiaTable
                tipoGuarderias={tipoGuarderias}
                isLoading={isLoading}
                error={error || undefined}
                onRetry={refetch}
                onEdit={handleEdit}
            />

            {editingTipoGuarderiaId && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Alterar Valor"
                    size="lg"
                >
                    <TipoGuarderiaForm
                        tipoGuarderiaId={editingTipoGuarderiaId}
                        onSuccess={handleSuccess}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    );
}

