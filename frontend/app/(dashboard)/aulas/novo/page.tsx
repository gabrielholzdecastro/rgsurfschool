"use client";

import { AulaForm } from "@/components/aulas/AulaForm";

export default function NovaAulaPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Nova Aula</h1>
            <div className="max-w-2xl">
                <AulaForm />
            </div>
        </div>
    );
}
