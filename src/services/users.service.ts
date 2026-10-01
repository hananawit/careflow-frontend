import { apiRequest } from "./api";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

export interface CareFlowUser {
  id: string;
  keycloakId: string;
  email: string;
  status: UserStatus;
  personProfile?: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
  } | null;
  roles: Array<Role & { permissions: string[] }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: CareFlowUser[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserPayload {
  status?: UserStatus;
  roleIds?: string[];
  firstName?: string;
  lastName?: string;
}

export function getUsers(params: { page: number; limit: number; search?: string; status?: UserStatus | "" }) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  return apiRequest<UserListResponse>(`/users?${query.toString()}`);
}

export function getRoles() {
  return apiRequest<Role[]>("/users/roles");
}

export function updateUser(id: string, data: UpdateUserPayload) {
  return apiRequest<CareFlowUser>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
