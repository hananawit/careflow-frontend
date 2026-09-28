import { apiRequest } from "./api";

export type ConsultationStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface Consultation {
  id: string;
  encounterId: string;
  doctorProfileId: string;
  patientHospitalId: string;

  status: ConsultationStatus;

  chiefComplaint: string | null;
  historyOfPresentIllness: string | null;
  physicalExamination: string | null;
  assessment: string | null;
  treatmentPlan: string | null;
  followUpInstructions: string | null;

  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationDto {
  encounterId: string;
  doctorProfileId: string;
  patientHospitalId: string;

  status?: ConsultationStatus;

  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  assessment?: string;
  treatmentPlan?: string;
  followUpInstructions?: string;
}

export async function createConsultation(
  data: CreateConsultationDto,
): Promise<Consultation> {
  return apiRequest<Consultation>("/consultation", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getConsultations(): Promise<Consultation[]> {
  return apiRequest<Consultation[]>("/consultation");
}

export async function getConsultation(
  id: string,
): Promise<Consultation> {
  return apiRequest<Consultation>(
    `/consultation/${id}`,
  );
}

export async function updateConsultation(
  id: string,
  data: Partial<CreateConsultationDto>,
): Promise<Consultation> {
  return apiRequest<Consultation>(
    `/consultation/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

