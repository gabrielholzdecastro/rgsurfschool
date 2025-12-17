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
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTipoAulas = useMemo(() => {
        return filterBySearch(tipoAulas, searchTerm, ["nome"]);
    }, [tipoAulas, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Tipos de Aula</h1>
                <Button onClick={() => setIsModalOpen(true)}>Novo Tipo de Aula</Button>
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
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Novo Tipo de Aula"
                size="lg"
            >
                <TipoAulaForm
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

