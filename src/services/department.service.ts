import { apiRequest } from "./api";

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  description?: string | null;
  status: DepartmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateDepartmentPayload {
  hospitalId: string;
  name: string;
  code: string;
  description?: string;
  status?: DepartmentStatus;
}

export type UpdateDepartmentPayload =
  Partial<CreateDepartmentPayload>;

export interface DepartmentListResponse {
  data: Department[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getDepartments(
  hospitalId: string,
  page = 1,
  limit = 10,
) {
  return apiRequest<DepartmentListResponse>(
    `/departments?hospitalId=${hospitalId}&page=${page}&limit=${limit}`,
  );
}

export function getDepartment(id: string) {
  return apiRequest<Department>(`/departments/${id}`);
}

export function createDepartment(
  data: CreateDepartmentPayload,
) {
  return apiRequest<Department>("/departments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDepartment(
  id: string,
  data: UpdateDepartmentPayload,
) {
  return apiRequest<Department>(`/departments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteDepartment(id: string) {
  return apiRequest<Department>(`/departments/${id}`, {
    method: "DELETE",
  });
}