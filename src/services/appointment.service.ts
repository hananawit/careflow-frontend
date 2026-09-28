import { apiRequest } from "./api";
import type {
  WorkflowState,
} from "./workflow.service";

export interface AppointmentWorkflowAction {
  id: string;
  actionCode: string;
  actionLabel: string;
  description?: string | null;
  toState: WorkflowState;
  uiConfig?: unknown;
}

export interface AppointmentWorkflowInstance {
  id: string;
  workflowId: string;
  workflowVersionId: string;
  currentStateId: string;
  entityType: string;
  entityId: string;
  startedAt: string;
  completedAt?: string | null;
  currentState?: WorkflowState;
}

export interface AppointmentPerson {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber?: string | null;
}

export interface AppointmentPatient {
  id: string;
  medicalRecordNumber: string;
  isPrimary: boolean;
  status: string;
  patientProfile: {
    id: string;
    personProfile: AppointmentPerson;
  };
}

export interface AppointmentDoctor {
  id: string;
  staffProfile: {
    id: string;
    personProfile: AppointmentPerson;
  };
}

export interface Appointment {
  id: string;
  hospitalId: string;
  patientHospitalId: string;
  doctorProfileId: string;
  appointmentType: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason?: string | null;
  status: string;

  hospital?: {
    id: string;
    name: string;
    code: string;
  } | null;

  patientHospital?: AppointmentPatient | null;

  doctorProfile?: AppointmentDoctor | null;

  encounter?: {
    id: string;
    hospitalId?: string;
    appointmentId?: string | null;
    patientHospitalId?: string;
    doctorProfileId?: string;
    encounterType?: string;
    status?: string;
    startedAt?: string;
    endedAt?: string | null;
    consultation?: {
      id: string;
      status: string;
    } | null;
  } | null;

  triage?: {
    id: string;
    priority?: string;
    chiefComplaint?: string | null;
    painScore?: number | null;
    notes?: string | null;
  } | null;

  workflowInstance?: AppointmentWorkflowInstance | null;
  workflowState?: WorkflowState | null;
  availableWorkflowActions?: AppointmentWorkflowAction[];
}

export async function getAppointments(): Promise<Appointment[]> {
  return apiRequest<Appointment[]>("/appointments");
}

export async function getAppointment(
  id: string,
): Promise<Appointment> {
  return apiRequest<Appointment>(`/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>,
): Promise<Appointment> {
  return apiRequest<Appointment>(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAppointmentWorkflowActions(
  id: string,
): Promise<AppointmentWorkflowAction[]> {
  return apiRequest<AppointmentWorkflowAction[]>(
    `/appointments/${id}/workflow-actions`,
  );
}

export async function executeAppointmentWorkflowTransition(
  appointmentId: string,
  transitionId: string,
): Promise<Appointment> {
  return apiRequest<Appointment>(
    `/appointments/${appointmentId}/workflow-transitions/${transitionId}`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}

