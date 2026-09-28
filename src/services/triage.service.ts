import { apiRequest } from "./api";

export interface Triage {
  id: string;
  appointmentId: string | null;
  nurseId: string | null;

  chiefComplaint: string;

  systolicBP: number | null;
  diastolicBP: number | null;
  pulse: number | null;
  respiratoryRate: number | null;
  temperature: number | null;
  oxygenSaturation: number | null;

  weight: number | null;
  height: number | null;
  bmi: number | null;

  painScore: number | null;

  priority:
    | "EMERGENCY"
    | "VERY_URGENT"
    | "URGENT"
    | "STANDARD"
    | "NON_URGENT";

  notes: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateTriageDto {
  appointmentId?: string;
  nurseId?: string;

  chiefComplaint: string;

  systolicBP?: number;
  diastolicBP?: number;
  pulse?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;

  weight?: number;
  height?: number;

  painScore?: number;

  priority:
    | "EMERGENCY"
    | "VERY_URGENT"
    | "URGENT"
    | "STANDARD"
    | "NON_URGENT";

  notes?: string;
}

export async function createTriage(
  data: CreateTriageDto,
): Promise<Triage> {
  return apiRequest<Triage>("/triage", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTriages(): Promise<Triage[]> {
  return apiRequest<Triage[]>("/triage");
}

export async function getTriage(id: string): Promise<Triage> {
  return apiRequest<Triage>(`/triage/${id}`);
}

export async function updateTriage(
  id: string,
  data: Partial<CreateTriageDto>,
): Promise<Triage> {
  return apiRequest<Triage>(`/triage/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTriage(id: string): Promise<void> {
  await apiRequest(`/triage/${id}`, {
    method: "DELETE",
  });
}