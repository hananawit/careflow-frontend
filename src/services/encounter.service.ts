import { apiRequest } from "./api";

export type EncounterType =
  | "OUTPATIENT"
  | "INPATIENT"
  | "EMERGENCY"
  | "TELEMEDICINE"
  | "WALK_IN";

export interface Encounter {
  id: string;
  hospitalId: string;
  appointmentId: string | null;
  patientHospitalId: string;
  doctorProfileId: string;
  encounterType: EncounterType;
  status: string;
  startedAt: string;
  endedAt: string | null;
}

export interface CreateEncounterDto {
  hospitalId: string;
  appointmentId?: string;
  patientHospitalId: string;
  doctorProfileId: string;
  encounterType: EncounterType;
}

export async function createEncounter(
  data: CreateEncounterDto,
): Promise<Encounter> {
  return apiRequest<Encounter>("/encounters", {
    method: "POST",
    body: JSON.stringify(data),
  });
}