import { apiRequest } from "./api";
import type { Gender } from "./patient.service";

export type StaffType =
  | "DOCTOR"
  | "NURSE"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "RADIOLOGIST"
  | "RECEPTIONIST"
  | "CASHIER"
  | "ADMINISTRATOR";

export interface StaffMember {
  id: string;
  hospitalId: string;
  departmentId: string;
  employeeNumber: string;
  staffType: StaffType;
  personProfile: { firstName: string; middleName?: string | null; lastName: string; gender: Gender; phoneNumber?: string | null };
  department?: { id: string; name: string; code: string } | null;
  doctorProfile?: { id: string; specialization: string; medicalLicenseNumber: string } | null;
}

export interface CreateStaffPayload {
  hospitalId: string;
  departmentId: string;
  employeeNumber: string;
  staffType: StaffType;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  phoneNumber?: string;
  specialization?: string;
  medicalLicenseNumber?: string;
}

export function getStaff(): Promise<StaffMember[]> {
  return apiRequest<StaffMember[]>("/staff?page=1&limit=100");
}

export function createStaff(data: CreateStaffPayload): Promise<StaffMember> {
  return apiRequest<StaffMember>("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
