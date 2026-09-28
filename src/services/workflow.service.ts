import { apiRequest } from "./api";

export type WorkflowEntityType =
  | "APPOINTMENT"
  | "TRIAGE"
  | "ENCOUNTER"
  | "CONSULTATION"
  | "PRESCRIPTION"
  | "LABORATORY_REQUEST"
  | "PATIENT";

export type WorkflowStateType =
  | "INITIAL"
  | "NORMAL"
  | "FINAL"
  | "CANCELLED";

export interface WorkflowState {
  id: string;
  versionId: string;
  code: string;
  name: string;
  description?: string | null;
  type: WorkflowStateType;
  displayOrder: number;
  color?: string | null;
  isActive: boolean;
}

export interface WorkflowTransition {
  id: string;
  versionId: string;
  fromStateId: string;
  toStateId: string;
  actionCode: string;
  actionLabel: string;
  description?: string | null;
  requiredPermissionId?: string | null;
  conditions?: unknown;
  uiConfig?: unknown;
  displayOrder: number;
  isActive: boolean;

  fromState?: WorkflowState;
  toState?: WorkflowState;
  requiredPermission?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string | null;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
}

export interface Workflow {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  entityType: WorkflowEntityType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  versions: WorkflowVersion[];
}

export interface CreateWorkflowDto {
  code: string;
  name: string;
  description?: string;
  entityType: WorkflowEntityType;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateWorkflowStateDto {
  code?: string;
  name?: string;
  description?: string;
  type?: WorkflowStateType;
  displayOrder?: number;
  color?: string;
  isActive?: boolean;
}

export interface UpdateWorkflowTransitionDto {
  fromStateId?: string;
  toStateId?: string;
  actionCode?: string;
  actionLabel?: string;
  description?: string;
  requiredPermissionId?: string;
  conditions?: unknown;
  uiConfig?: unknown;
  displayOrder?: number;
  isActive?: boolean;
}

export async function getWorkflows(): Promise<Workflow[]> {
  return apiRequest<Workflow[]>("/workflows");
}

export async function getWorkflow(
  id: string,
): Promise<Workflow> {
  return apiRequest<Workflow>(
    `/workflows/${id}`,
  );
}

export async function createWorkflow(
  data: CreateWorkflowDto,
): Promise<Workflow> {
  return apiRequest<Workflow>("/workflows", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateWorkflow(
  id: string,
  data: UpdateWorkflowDto,
): Promise<Workflow> {
  return apiRequest<Workflow>(
    `/workflows/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteWorkflow(
  id: string,
): Promise<void> {
  await apiRequest(`/workflows/${id}`, {
    method: "DELETE",
  });
}

export async function getWorkflowStates(
  workflowId: string,
  versionId: string,
): Promise<WorkflowState[]> {
  return apiRequest<WorkflowState[]>(
    `/workflows/${workflowId}/versions/${versionId}/states`,
  );
}

export async function createWorkflowState(
  workflowId: string,
  versionId: string,
  data: {
    code: string;
    name: string;
    description?: string;
    type?: WorkflowStateType;
    displayOrder?: number;
    color?: string;
  },
): Promise<WorkflowState> {
  return apiRequest<WorkflowState>(
    `/workflows/${workflowId}/versions/${versionId}/states`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateWorkflowState(
  workflowId: string,
  versionId: string,
  stateId: string,
  data: UpdateWorkflowStateDto,
): Promise<WorkflowState> {
  return apiRequest<WorkflowState>(
    `/workflows/${workflowId}/versions/${versionId}/states/${stateId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteWorkflowState(
  workflowId: string,
  versionId: string,
  stateId: string,
): Promise<void> {
  await apiRequest(
    `/workflows/${workflowId}/versions/${versionId}/states/${stateId}`,
    {
      method: "DELETE",
    },
  );
}

export async function getWorkflowTransitions(
  workflowId: string,
  versionId: string,
): Promise<WorkflowTransition[]> {
  return apiRequest<WorkflowTransition[]>(
    `/workflows/${workflowId}/versions/${versionId}/transitions`,
  );
}
export async function publishWorkflowVersion(
  workflowId: string,
  versionId: string,
): Promise<Workflow> {
  return apiRequest<Workflow>(
    `/workflows/${workflowId}/versions/${versionId}/publish`,
    {
      method: "POST",
    },
  );
}
export async function createWorkflowTransition(
  workflowId: string,
  versionId: string,
  data: {
    fromStateId: string;
    toStateId: string;
    actionCode: string;
    actionLabel: string;
    description?: string;
    requiredPermissionId?: string;
    conditions?: unknown;
    uiConfig?: unknown;
    displayOrder?: number;
  },
): Promise<WorkflowTransition> {
  return apiRequest<WorkflowTransition>(
    `/workflows/${workflowId}/versions/${versionId}/transitions`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  
}

export async function updateWorkflowTransition(
  workflowId: string,
  versionId: string,
  transitionId: string,
  data: UpdateWorkflowTransitionDto,
): Promise<WorkflowTransition> {
  return apiRequest<WorkflowTransition>(
    `/workflows/${workflowId}/versions/${versionId}/transitions/${transitionId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteWorkflowTransition(
  workflowId: string,
  versionId: string,
  transitionId: string,
): Promise<void> {
  await apiRequest(
    `/workflows/${workflowId}/versions/${versionId}/transitions/${transitionId}`,
    {
      method: "DELETE",
    },
  );
}
