"use client";

import { TripForm } from "@/components/trips/TripForm";

export default function NovaTripPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nova Trip</h1>
      <TripForm />
    </div>
  );
}
