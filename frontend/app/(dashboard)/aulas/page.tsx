"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { AulaCalendar } from "@/components/aulas/AulaCalendar";
import { useAulas } from "@/hooks/useAulas";
import { deleteAula, quitarAula } from "@/lib/api/aula";
import { Modal } from "@/components/ui/Modal";
import { AulaForm } from "@/components/aulas/AulaForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";


export default function AulasPage() {
    const { aulas, isLoading, error, refetch } = useAulas();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAulas = useMemo(() => {
        return filterBySearch(aulas, searchTerm, ["nomeAluno"]);
    }, [aulas, searchTerm]);

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

    return (
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nova Aula</Button>
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
      />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nova Aula"
                size="lg"
            >
                <AulaForm
                    onSuccess={() => {
                        setIsModalOpen(false);
                        refetch();
                    }}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
