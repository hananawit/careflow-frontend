import { apiRequest } from "./api";

export type HospitalType =
  | "PUBLIC"
  | "PRIVATE"
  | "CLINIC"
  | "SPECIALTY";

export type HospitalStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Hospital {
  id: string;
  name: string;
  code: string;
  type: HospitalType;
  licenseNumber?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  status: HospitalStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateHospitalPayload {
  name: string;
  code: string;
  type: HospitalType;
  licenseNumber?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  status?: HospitalStatus;
}

export type UpdateHospitalPayload =
  Partial<CreateHospitalPayload>;

export interface HospitalListResponse {
  data: Hospital[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getHospitals(
  page = 1,
  limit = 10,
): Promise<HospitalListResponse> {
  return apiRequest<HospitalListResponse>(
    `/hospitals?page=${page}&limit=${limit}`,
  );
}

export function getHospital(
  id: string,
): Promise<Hospital> {
  return apiRequest<Hospital>(`/hospitals/${id}`);
}

export function createHospital(
  data: CreateHospitalPayload,
): Promise<Hospital> {
  return apiRequest<Hospital>("/hospitals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateHospital(
  id: string,
  data: UpdateHospitalPayload,
): Promise<Hospital> {
  return apiRequest<Hospital>(`/hospitals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteHospital(
  id: string,
): Promise<Hospital> {
  return apiRequest<Hospital>(`/hospitals/${id}`, {
    method: "DELETE",
  });
}