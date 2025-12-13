"use client";

import { useParams } from "next/navigation";
import { TripForm } from "@/components/trips/TripForm";

export default function EditarTripPage() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const id = idParam ? Number(idParam) : undefined;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Editar Trip</h1>
      {id ? <TripForm tripId={id} /> : <p>Trip não encontrada</p>}
    </div>
  );
}
