import { apiRequest } from "./api";

export type LaboratoryRequestStatus =
  | "REQUESTED"
  | "COLLECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface LaboratoryPerson {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}

export interface LaboratoryResult {
  id: string;
  laboratoryRequestId: string;
  result: string;
  verifiedById?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LaboratoryRequest {
  id: string;
  consultationId: string;
  requestedByDoctorId: string;
  notes?: string | null;
  status: LaboratoryRequestStatus;
  createdAt: string;
  updatedAt: string;
  consultation?: {
    id: string;
    patientHospitalId?: string;
    patientHospital?: { patientProfile?: { personProfile?: LaboratoryPerson } };
  } | null;
  requestedByDoctor?: { staffProfile?: { personProfile?: LaboratoryPerson } } | null;
  result?: LaboratoryResult | null;
}

export interface CreateLaboratoryRequestDto {
  consultationId: string;
  requestedByDoctorId: string;
  notes?: string;
}

export function getLaboratoryRequests(): Promise<LaboratoryRequest[]> {
  return apiRequest<LaboratoryRequest[]>("/laboratory-request?limit=100");
}

export function createLaboratoryRequest(data: CreateLaboratoryRequestDto): Promise<LaboratoryRequest> {
  return apiRequest<LaboratoryRequest>("/laboratory-request", { method: "POST", body: JSON.stringify(data) });
}

export function getLaboratoryRequest(id: string): Promise<LaboratoryRequest> {
  return apiRequest<LaboratoryRequest>(`/laboratory-request/${id}`);
}

export function createLaboratoryResult(data: { laboratoryRequestId: string; result: string; verifiedById?: string }): Promise<LaboratoryResult> {
  return apiRequest<LaboratoryResult>("/laboratory-result", { method: "POST", body: JSON.stringify(data) });
}
