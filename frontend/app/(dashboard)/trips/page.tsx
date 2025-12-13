"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TripTable } from "@/components/trips/TripTable";
import { useTrips } from "@/hooks/useTrips";

export default function TripsPage() {
  const { trips, isLoading, error, refetch } = useTrips();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
        <Link href="/trips/novo">
          <Button>Nova Trip</Button>
        </Link>
      </div>

      <TripTable
        trips={trips}
        isLoading={isLoading}
        error={error || undefined}
        onRetry={refetch}
        onDelete={refetch}
      />
    </div>
  );
}
