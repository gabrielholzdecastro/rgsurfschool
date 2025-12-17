"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { AlunoList } from "@/components/alunos/AlunoList";
import { useAlunos } from "@/hooks/useAlunos";
import { Modal } from "@/components/ui/Modal";
import { AlunoForm } from "@/components/alunos/AlunoForm";
import { SearchBar } from "@/components/ui/SearchBar";
import { filterBySearch } from "@/lib/utils";

export default function AlunosPage() {
  const { alunos, isLoading, error, refetch } = useAlunos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlunos = useMemo(() => {
    return filterBySearch(alunos, searchTerm, ["nome", "email", "telefone"]);
  }, [alunos, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo Aluno</Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Pesquisar por nome, email ou telefone..."
      />

      <AlunoList
        alunos={filteredAlunos}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Aluno"
        size="md"
      >
        <AlunoForm
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

