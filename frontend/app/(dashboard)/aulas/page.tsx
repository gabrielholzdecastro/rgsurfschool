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


export default function AulasPage() {
    const { aulas, isLoading, error, refetch } = useAulas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAulaId, setEditingAulaId] = useState<number | undefined>(undefined);
    const [editingAula, setEditingAula] = useState<AulaResponse | undefined>(undefined);
    const [isLoadingAula, setIsLoadingAula] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleDelete = async (id: number) => {
        try {
            await deleteAula(id);
            refetch();
        } catch (e) {
            alert("Erro ao excluir aula");
        }
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
        onDelete={handleDelete}
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
        </div>
    );
}
