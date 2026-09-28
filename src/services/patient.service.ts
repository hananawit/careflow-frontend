import { apiRequest } from "./api";

export type Gender = "MALE" | "FEMALE";

export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "UNKNOWN";

export interface Address {
  id?: string;
  personProfileId?: string;
  hospitalId?: string;

  country: string;
  region: string;
  city: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface PersonProfile {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string | null;
  phoneNumber: string;
  nationalId?: string | null;

  address?: Address | null;
}

export interface PatientHospitalRegistration {
  id: string;
  hospitalId: string;
  medicalRecordNumber: string;
  registrationDate: string;
  isPrimary: boolean;
  status: string;

  hospital?: {
    id: string;
    name: string;
  };
}

export interface Patient {
  id: string;
  personProfileId: string;

  personProfile: PersonProfile;

  bloodType?: BloodType | null;
  allergies?: string | null;

  createdAt: string;
  updatedAt: string;

  hospitalRegistrations: PatientHospitalRegistration[];
}

/*
 * IMPORTANT:
 *
 * Address is NOT included here.
 *
 * Address is created separately using address.service.ts
 */
export interface PatientPayload {
  firstName: string;
  middleName?: string;
  lastName: string;

  gender: Gender;

  dateOfBirth?: string;

  phoneNumber: string;

  nationalId?: string;

  bloodType?: BloodType;

  allergies?: string;
}

/**
 * Get all patients
 */
export async function getPatients(
  search = "",
): Promise<Patient[]> {
  const params = new URLSearchParams({
    page: "1",
    limit: "100",
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  return apiRequest<Patient[]>(
    `/patients?${params.toString()}`,
  );
}

/**
 * Get one patient
 */
export async function getPatient(
  id: string,
): Promise<Patient> {
  return apiRequest<Patient>(
    `/patients/${id}`,
  );
}

/**
 * Create patient
 *
 * IMPORTANT:
 * Hospital ID is NOT sent here.
 *
 * The patient endpoint receives only patient information.
 * Address is created separately after the patient is created.
 */
export async function createPatient(
  data: PatientPayload,
): Promise<Patient> {
  return apiRequest<Patient>(
    "/patients",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Update patient
 */
export async function updatePatient(
  id: string,
  data: Partial<PatientPayload>,
): Promise<Patient> {
  return apiRequest<Patient>(
    `/patients/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}