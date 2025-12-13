"use client";

import { useEffect, useState } from "react";
import { TripResponse } from "@/types/trip";
import { getTrips } from "@/lib/api/trips";

export function useTrips() {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar trips");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    isLoading,
    error,
    refetch: fetchTrips,
  };
}
