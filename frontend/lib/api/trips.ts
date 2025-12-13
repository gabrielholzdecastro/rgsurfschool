import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import { TripRequest, TripResponse } from "@/types/trip";

const BASE_PATH = "/api/trip";

export async function getTrips(): Promise<TripResponse[]> {
  return apiGet<TripResponse[]>(BASE_PATH);
}

export async function getTrip(id: number): Promise<TripResponse> {
  return apiGet<TripResponse>(`${BASE_PATH}/${id}`);
}

export async function createTrip(data: TripRequest): Promise<TripResponse> {
  return apiPost<TripResponse>(BASE_PATH, data);
}

export async function updateTrip(
  id: number,
  data: TripRequest
): Promise<TripResponse> {
  return apiPut<TripResponse>(`${BASE_PATH}/${id}`, data);
}

export async function deleteTrip(id: number): Promise<void> {
  return apiDelete(`${BASE_PATH}/${id}`);
}
