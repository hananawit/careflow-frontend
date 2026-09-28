import { apiRequest } from "./api";
import type { Gender } from "./patient.service";

export interface StaffMember {
  id: string;
  hospitalId: string;
  departmentId: string;
  employeeNumber: string;
  staffType: string;
  personProfile: { firstName: string; middleName?: string | null; lastName: string; gender: Gender; phoneNumber?: string | null };
  department?: { id: string; name: string; code: string } | null;
  doctorProfile?: { id: string; specialization: string; medicalLicenseNumber: string } | null;
}

export function getStaff(): Promise<StaffMember[]> {
  return apiRequest<StaffMember[]>("/staff?page=1&limit=100");
}
