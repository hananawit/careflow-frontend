import { useEffect, useState } from "react";

import {
  createWorkflow,
  createWorkflowState,
  createWorkflowTransition,
  deleteWorkflowState,
  deleteWorkflowTransition,
  getWorkflow,
  getWorkflows,
publishWorkflowVersion,

  updateWorkflow,
  updateWorkflowState,
  updateWorkflowTransition,
  type Workflow,
  type WorkflowEntityType,
  type WorkflowState,
  type WorkflowStateType,
  type WorkflowTransition,
} from "../../../services/workflow.service";

const entityTypes: {
  value: WorkflowEntityType;
  label: string;
}[] = [
  {
    value: "APPOINTMENT",
    label: "Appointment",
  },
  {
    value: "TRIAGE",
    label: "Triage",
  },
  {
    value: "ENCOUNTER",
    label: "Encounter",
  },
  {
    value: "CONSULTATION",
    label: "Consultation",
  },
  {
    value: "PRESCRIPTION",
    label: "Prescription",
  },
  {
    value: "LABORATORY_REQUEST",
    label: "Laboratory Request",
  },
  {
    value: "PATIENT",
    label: "Patient",
  },
];

const stateTypes: {
  value: WorkflowStateType;
  label: string;
}[] = [
  {
    value: "INITIAL",
    label: "Initial",
  },
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "FINAL",
    label: "Final",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

function getApiErrorMessage(
  err: unknown,
  fallback: string,
) {
  if (!(err instanceof Error)) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(
      err.message,
    ) as {
      message?: string | string[];
    };

    if (
      typeof parsed.message ===
      "string"
    ) {
      return parsed.message;
    }

    if (
      Array.isArray(parsed.message)
    ) {
      return parsed.message.join(" ");
    }
  } catch {
    return (
      err.message || fallback
    );
  }

  return err.message || fallback;
}

export function WorkflowConfiguration() {
  const [workflows, setWorkflows] =
    useState<Workflow[]>([]);

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<Workflow | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showWorkflowModal, setShowWorkflowModal] =
    useState(false);

  const [showStateModal, setShowStateModal] =
    useState(false);

  const [editingState, setEditingState] =
    useState<WorkflowState | null>(null);

  const [showTransitionModal, setShowTransitionModal] =
    useState(false);

  const [editingTransition, setEditingTransition] =
    useState<WorkflowTransition | null>(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // =========================================================
  // WORKFLOW FORM
  // =========================================================

  const [workflowForm, setWorkflowForm] =
    useState({
      code: "",
      name: "",
      description: "",
      entityType:
        "APPOINTMENT" as WorkflowEntityType,
    });

  // =========================================================
  // STATE FORM
  // =========================================================

  const [stateForm, setStateForm] =
    useState({
      code: "",
      name: "",
      description: "",
      type: "NORMAL" as WorkflowStateType,
      displayOrder: 0,
      color: "",
    });

  function resetStateForm() {
    setStateForm({
      code: "",
      name: "",
      description: "",
      type: "NORMAL",
      displayOrder: 0,
      color: "",
    });
  }

  function openCreateStateModal() {
    setEditingState(null);
    resetStateForm();
    setShowStateModal(true);
  }

  function openEditStateModal(
    state: WorkflowState,
  ) {
    setEditingState(state);
    setStateForm({
      code: state.code,
      name: state.name,
      description:
        state.description ?? "",
      type: state.type,
      displayOrder:
        state.displayOrder,
      color: state.color ?? "",
    });
    setShowStateModal(true);
  }

  function closeStateModal() {
    setShowStateModal(false);
    setEditingState(null);
    resetStateForm();
  }

  // =========================================================
  // TRANSITION FORM
  // =========================================================

  const [transitionForm, setTransitionForm] =
    useState({
      fromStateId: "",
      toStateId: "",
      actionCode: "",
      actionLabel: "",
      description: "",
      displayOrder: 0,
    });

  function resetTransitionForm() {
    setTransitionForm({
      fromStateId: "",
      toStateId: "",
      actionCode: "",
      actionLabel: "",
      description: "",
      displayOrder: 0,
    });
  }

  function openCreateTransitionModal() {
    setEditingTransition(null);
    resetTransitionForm();
    setShowTransitionModal(true);
  }

  function openEditTransitionModal(
    transition: WorkflowTransition,
  ) {
    setEditingTransition(transition);
    setTransitionForm({
      fromStateId:
        transition.fromStateId,
      toStateId:
        transition.toStateId,
      actionCode:
        transition.actionCode,
      actionLabel:
        transition.actionLabel,
      description:
        transition.description ?? "",
      displayOrder:
        transition.displayOrder,
    });
    setShowTransitionModal(true);
  }

  function closeTransitionModal() {
    setShowTransitionModal(false);
    setEditingTransition(null);
    resetTransitionForm();
  }

  // =========================================================
  // LOAD WORKFLOWS
  // =========================================================

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getWorkflows();

      setWorkflows(data);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load workflows.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // OPEN WORKFLOW
  // =========================================================

  async function openWorkflow(
    workflowId: string,
  ) {
    try {
      setError("");
      setMessage("");

      const workflow =
        await getWorkflow(
          workflowId,
        );

      setSelectedWorkflow(workflow);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load workflow.",
      );
    }
  }

  // =========================================================
  // CREATE WORKFLOW
  // =========================================================

  async function handleCreateWorkflow(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!workflowForm.code.trim()) {
      setError(
        "Workflow code is required.",
      );
      return;
    }

    if (!workflowForm.name.trim()) {
      setError(
        "Workflow name is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const workflow =
        await createWorkflow({
          code:
            workflowForm.code
              .trim()
              .toUpperCase(),

          name:
            workflowForm.name.trim(),

          description:
            workflowForm.description.trim() ||
            undefined,

          entityType:
            workflowForm.entityType,
        });

      setWorkflows(
        (previous) => [
          workflow,
          ...previous,
        ],
      );

      setSelectedWorkflow(
        workflow,
      );

      setWorkflowForm({
        code: "",
        name: "",
        description: "",
        entityType: "APPOINTMENT",
      });

      setShowWorkflowModal(
        false,
      );

      setMessage(
        "Workflow created successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to create workflow.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ACTIVATE / DEACTIVATE
  // =========================================================

  async function toggleWorkflow(
    workflow: Workflow,
  ) {
    try {
      setError("");
      setMessage("");

      const updated =
        await updateWorkflow(
          workflow.id,
          {
            isActive:
              !workflow.isActive,
          },
        );

      setWorkflows(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              updated.id
                ? updated
                : item,
          ),
      );

      await openWorkflow(
        updated.id,
      );

      setMessage(
        updated.isActive
          ? "Workflow activated."
          : "Workflow deactivated.",
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to update workflow.",
      );
    }
  }
async function handlePublish() {
  if (!selectedWorkflow) {
    return;
  }

  const version =
    selectedWorkflow.versions?.[0];

  if (!version) {
    setError(
      "This workflow does not have a version.",
    );
    return;
  }

  const states = version.states ?? [];

  const initialStates = states.filter(
    (state) => state.type === "INITIAL",
  );

  const finalStates = states.filter(
    (state) => state.type === "FINAL",
  );

  if (initialStates.length !== 1) {
    setError(
      "The workflow must have exactly one Initial state.",
    );
    return;
  }

  if (finalStates.length === 0) {
    setError(
      "The workflow must have at least one Final state.",
    );
    return;
  }

  try {
    setSaving(true);
    setError("");
    setMessage("");

    const published =
      await publishWorkflowVersion(
        selectedWorkflow.id,
        version.id,
      );

    setSelectedWorkflow(published);

    setWorkflows((previous) =>
      previous.map((item) =>
        item.id === published.id
          ? published
          : item,
      ),
    );

    setMessage(
      `Version ${version.version} published successfully.`,
    );
  } catch (err) {
    console.error(err);
    setError(
      "Failed to publish workflow version.",
    );
  } finally {
    setSaving(false);
  }
}
  // =========================================================
  // CREATE / UPDATE STATE
  // =========================================================

  async function handleSaveState(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!selectedWorkflow) {
      return;
    }

    const version =
      selectedWorkflow.versions?.[0];

    if (!version) {
      setError(
        "This workflow does not have a version.",
      );
      return;
    }

    if (!stateForm.code.trim()) {
      setError(
        "State code is required.",
      );
      return;
    }

    if (!stateForm.name.trim()) {
      setError(
        "State name is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingState) {
        await updateWorkflowState(
          selectedWorkflow.id,
          version.id,
          editingState.id,
          {
            code:
              stateForm.code
                .trim()
                .toUpperCase(),

            name:
              stateForm.name.trim(),

            description:
              stateForm.description.trim(),

            type:
              stateForm.type,

            displayOrder:
              Number(
                stateForm.displayOrder,
              ),

            color:
              stateForm.color.trim(),
          },
        );
      } else {
        await createWorkflowState(
          selectedWorkflow.id,
          version.id,
          {
            code:
              stateForm.code
                .trim()
                .toUpperCase(),

            name:
              stateForm.name.trim(),

            description:
              stateForm.description.trim() ||
              undefined,

            type:
              stateForm.type,

            displayOrder:
              Number(
                stateForm.displayOrder,
              ),

            color:
              stateForm.color.trim() ||
              undefined,
          },
        );
      }

      await openWorkflow(
        selectedWorkflow.id,
      );

      closeStateModal();

      setMessage(
        editingState
          ? "Workflow state updated successfully."
          : "Workflow state added successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        editingState
          ? "Failed to update workflow state."
          : "Failed to create workflow state.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE STATE
  // =========================================================

  async function handleDeleteState(
    state: WorkflowState,
  ) {
    if (!selectedWorkflow) {
      return;
    }

    const version =
      selectedWorkflow.versions?.[0];

    if (!version) {
      setError(
        "This workflow does not have a version.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow state?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await deleteWorkflowState(
        selectedWorkflow.id,
        version.id,
        state.id,
      );

      await openWorkflow(
        selectedWorkflow.id,
      );

      setMessage(
        "Workflow state deleted successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Failed to delete workflow state.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // CREATE / UPDATE TRANSITION
  // =========================================================

  async function handleSaveTransition(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!selectedWorkflow) {
      return;
    }

    const version =
      selectedWorkflow.versions?.[0];

    if (!version) {
      setError(
        "This workflow does not have a version.",
      );
      return;
    }

    if (
      !transitionForm.fromStateId
    ) {
      setError(
        "Select the starting state.",
      );
      return;
    }

    if (
      !transitionForm.toStateId
    ) {
      setError(
        "Select the destination state.",
      );
      return;
    }

    if (
      transitionForm.fromStateId ===
      transitionForm.toStateId
    ) {
      setError(
        "Starting and destination states must be different.",
      );
      return;
    }

    if (
      !transitionForm.actionCode.trim()
    ) {
      setError(
        "Action code is required.",
      );
      return;
    }

    if (
      !transitionForm.actionLabel.trim()
    ) {
      setError(
        "Action label is required.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        fromStateId:
          transitionForm.fromStateId,

        toStateId:
          transitionForm.toStateId,

        actionCode:
          transitionForm.actionCode
            .trim()
            .toUpperCase(),

        actionLabel:
          transitionForm.actionLabel
            .trim(),

        description:
          editingTransition
            ? transitionForm.description.trim()
            : transitionForm.description.trim() ||
              undefined,

        displayOrder:
          Number(
            transitionForm.displayOrder,
          ),
      };

      if (editingTransition) {
        await updateWorkflowTransition(
          selectedWorkflow.id,
          version.id,
          editingTransition.id,
          payload,
        );
      } else {
        await createWorkflowTransition(
          selectedWorkflow.id,
          version.id,
          payload,
        );
      }

      await openWorkflow(
        selectedWorkflow.id,
      );

      const wasEditing =
        Boolean(editingTransition);

      closeTransitionModal();

      setMessage(
        wasEditing
          ? "Workflow transition updated successfully."
          : "Workflow transition added successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          editingTransition
            ? "Failed to update workflow transition."
            : "Failed to create workflow transition.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE TRANSITION
  // =========================================================

  async function handleDeleteTransition(
    transition: WorkflowTransition,
  ) {
    if (!selectedWorkflow) {
      return;
    }

    const version =
      selectedWorkflow.versions?.[0];

    if (!version) {
      setError(
        "This workflow does not have a version.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow transition?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await deleteWorkflowTransition(
        selectedWorkflow.id,
        version.id,
        transition.id,
      );

      await openWorkflow(
        selectedWorkflow.id,
      );

      setMessage(
        "Workflow transition deleted successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Failed to delete workflow transition.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const latestVersion =
    selectedWorkflow?.versions?.[0];

  const states =
    latestVersion?.states ?? [];

  const transitions =
    latestVersion?.transitions ?? [];
const initialCount = states.filter(
  (state) => state.type === "INITIAL",
).length;

const finalCount = states.filter(
  (state) => state.type === "FINAL",
).length;

const canPublish =
  states.length > 0 &&
  initialCount === 1 &&
  finalCount > 0;
  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Workflow Configuration
          </h1>

          <p className="text-muted-foreground mt-1">
            Configure CareFlow processes, states, and actions.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowWorkflowModal(
              true,
            )
          }
          className="rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium hover:bg-primary/90"
        >
          + New Workflow
        </button>

      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================
            WORKFLOW LIST
        =================================================== */}

        <div className="bg-card border border-border rounded-2xl overflow-hidden">

          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">
              Workflows
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading workflows...
            </div>
          ) : workflows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No workflows configured yet.
            </div>
          ) : (
            <div className="divide-y divide-border">

              {workflows.map(
                (workflow) => (
                  <button
                    key={workflow.id}
                    type="button"
                    onClick={() =>
                      openWorkflow(
                        workflow.id,
                      )
                    }
                    className={`w-full text-left p-5 hover:bg-muted/50 transition-colors ${
                      selectedWorkflow?.id ===
                      workflow.id
                        ? "bg-primary/5"
                        : ""
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="font-semibold">
                          {workflow.name}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {workflow.code}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          workflow.isActive
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {workflow.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    <p className="text-sm text-muted-foreground mt-3">
                      {entityTypes.find(
                        (item) =>
                          item.value ===
                          workflow.entityType,
                      )?.label ??
                        workflow.entityType}
                    </p>

                  </button>
                ),
              )}

            </div>
          )}

        </div>

        {/* ===================================================
            WORKFLOW DETAILS
        =================================================== */}

        <div className="lg:col-span-2">

          {!selectedWorkflow ? (

            <div className="bg-card border border-border rounded-2xl p-10 text-center">

              <h2 className="text-xl font-semibold">
                Select a workflow
              </h2>

              <p className="text-muted-foreground mt-2">
                Choose a workflow to configure its states and transitions.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {/* Workflow header */}
              <div className="bg-card border border-border rounded-2xl p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Workflow
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      {selectedWorkflow.name}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedWorkflow.code}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleWorkflow(
                        selectedWorkflow,
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      selectedWorkflow.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {selectedWorkflow.isActive
                      ? "Active"
                      : "Activate"}
                  </button>

                </div>

                {selectedWorkflow.description && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {
                      selectedWorkflow.description
                    }
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mt-5">

                  <InfoBox
                    label="Entity"
                    value={
                      entityTypes.find(
                        (item) =>
                          item.value ===
                          selectedWorkflow.entityType,
                      )?.label ??
                      selectedWorkflow.entityType
                    }
                  />

                  <InfoBox
                    label="Version"
                    value={
                      latestVersion
                        ? `Version ${latestVersion.version}`
                        : "No version"
                    }
                  />

                </div>

              </div>
{/* =================================================
    PUBLISH VERSION
================================================= */}

<div className="bg-card border border-border rounded-2xl p-6">

  <div className="flex items-center justify-between gap-4">

    <div>
      <h3 className="text-lg font-semibold">
        Workflow Version
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        Version {latestVersion?.version ?? "—"}
        {" · "}
        {latestVersion?.isPublished
          ? "Published"
          : "Draft"}
      </p>
    </div>

    {latestVersion?.isPublished ? (
      <span className="px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium">
        Published
      </span>
    ) : (
      <button
        type="button"
        disabled={!canPublish || saving}
        onClick={handlePublish}
        className="rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-40"
      >
        {saving
          ? "Publishing..."
          : "Publish Version"}
      </button>
    )}

  </div>

  {!latestVersion?.isPublished && (
    <div className="mt-5 space-y-2 text-sm">

      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Initial states
        </span>

        <span
          className={
            initialCount === 1
              ? "text-success"
              : "text-destructive"
          }
        >
          {initialCount}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Final states
        </span>

        <span
          className={
            finalCount > 0
              ? "text-success"
              : "text-destructive"
          }
        >
          {finalCount}
        </span>
      </div>

      {!canPublish && (
        <p className="text-xs text-muted-foreground pt-2">
          The workflow needs exactly one Initial state
          and at least one Final state before it can be published.
        </p>
      )}

    </div>
  )}

</div>
              {/* =================================================
                  VISUAL FLOW
              ================================================= */}

              <div className="bg-card border border-border rounded-2xl p-6">

                <div className="mb-5">
                  <h3 className="text-lg font-semibold">
                    Workflow Flow
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Current state sequence.
                  </p>
                </div>

                {states.length === 0 ? (

                  <div className="rounded-xl bg-muted/50 p-6 text-sm text-muted-foreground">
                    Add states to visualize the workflow.
                  </div>

                ) : (

                  <div className="flex flex-wrap items-center gap-3">

                    {states.map(
                      (
                        state,
                        index,
                      ) => (

                        <div
                          key={state.id}
                          className="flex items-center gap-3"
                        >

                          <div
                            className="rounded-xl border border-border bg-background px-4 py-3 min-w-[150px]"
                            style={
                              state.color
                                ? {
                                    borderColor:
                                      state.color,
                                  }
                                : undefined
                            }
                          >

                            <p className="font-medium">
                              {state.name}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1">
                              {state.code}
                            </p>

                          </div>

                          {index <
                            states.length -
                              1 && (
                            <span className="text-muted-foreground text-xl">
                              →
                            </span>
                          )}

                        </div>

                      ),
                    )}

                  </div>

                )}

              </div>

              {/* =================================================
                  STATES
              ================================================= */}

              <div className="bg-card border border-border rounded-2xl p-6">

                <div className="flex items-center justify-between gap-4 mb-5">

                  <div>
                    <h3 className="text-lg font-semibold">
                      States
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Define the stages a record can occupy.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      openCreateStateModal
                    }
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    + Add State
                  </button>

                </div>

                {states.length === 0 ? (

                  <div className="rounded-xl bg-muted/50 p-6 text-sm text-muted-foreground">
                    No states configured.
                  </div>

                ) : (

                  <div className="space-y-3">

                    {states.map(
                      (
                        state,
                        index,
                      ) => (

                        <StateRow
                          key={state.id}
                          state={state}
                          index={index}
                          saving={saving}
                          onEdit={
                            openEditStateModal
                          }
                          onDelete={
                            handleDeleteState
                          }
                        />

                      ),
                    )}

                  </div>

                )}

              </div>

              {/* =================================================
                  TRANSITIONS
              ================================================= */}

              <div className="bg-card border border-border rounded-2xl p-6">

                <div className="flex items-center justify-between gap-4 mb-5">

                  <div>
                    <h3 className="text-lg font-semibold">
                      Transitions
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Define which actions move records between states.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={
                      states.length <
                      2
                    }
                    onClick={
                      openCreateTransitionModal
                    }
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
                  >
                    + Add Transition
                  </button>

                </div>

                {transitions.length ===
                0 ? (

                  <div className="rounded-xl bg-muted/50 p-6 text-sm text-muted-foreground">
                    {states.length < 2
                      ? "Add at least two states before creating a transition."
                      : "No transitions configured."}
                  </div>

                ) : (

                  <div className="space-y-3">

                    {transitions.map(
                      (
                        transition,
                      ) => (

                        <TransitionRow
                          key={
                            transition.id
                          }
                          transition={
                            transition
                          }
                          saving={saving}
                          onEdit={
                            openEditTransitionModal
                          }
                          onDelete={
                            handleDeleteTransition
                          }
                        />

                      ),
                    )}

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* =======================================================
          CREATE WORKFLOW MODAL
      ======================================================= */}

      {showWorkflowModal && (
        <Modal
          title="Create Workflow"
          onClose={() =>
            setShowWorkflowModal(
              false,
            )
          }
        >

          <form
            onSubmit={
              handleCreateWorkflow
            }
            className="space-y-5"
          >

            <Field
              label="Workflow Name"
              value={
                workflowForm.name
              }
              onChange={(value) =>
                setWorkflowForm({
                  ...workflowForm,
                  name: value,
                })
              }
              placeholder="OPD Patient Flow"
            />

            <Field
              label="Code"
              value={
                workflowForm.code
              }
              onChange={(value) =>
                setWorkflowForm({
                  ...workflowForm,
                  code: value,
                })
              }
              placeholder="OPD_PATIENT_FLOW"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Entity Type
              </label>

              <select
                value={
                  workflowForm.entityType
                }
                onChange={(event) =>
                  setWorkflowForm({
                    ...workflowForm,
                    entityType:
                      event.target
                        .value as WorkflowEntityType,
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              >
                {entityTypes.map(
                  (item) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <TextAreaField
              label="Description"
              value={
                workflowForm.description
              }
              onChange={(value) =>
                setWorkflowForm({
                  ...workflowForm,
                  description:
                    value,
                })
              }
              placeholder="Describe this workflow..."
            />

            <ModalActions
              onCancel={() =>
                setShowWorkflowModal(
                  false,
                )
              }
              saving={saving}
              submitLabel="Create Workflow"
            />

          </form>

        </Modal>
      )}

      {/* =======================================================
          CREATE STATE MODAL
      ======================================================= */}

      {showStateModal && (
        <Modal
          title={
            editingState
              ? "Edit Workflow State"
              : "Add Workflow State"
          }
          onClose={closeStateModal}
        >

          <form
            onSubmit={
              handleSaveState
            }
            className="space-y-5"
          >

            <Field
              label="State Name"
              value={
                stateForm.name
              }
              onChange={(value) =>
                setStateForm({
                  ...stateForm,
                  name: value,
                })
              }
              placeholder="Checked In"
            />

            <Field
              label="State Code"
              value={
                stateForm.code
              }
              onChange={(value) =>
                setStateForm({
                  ...stateForm,
                  code: value,
                })
              }
              placeholder="CHECKED_IN"
            />

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Type
                </label>

                <select
                  value={
                    stateForm.type
                  }
                  onChange={(event) =>
                    setStateForm({
                      ...stateForm,
                      type:
                        event.target
                          .value as WorkflowStateType,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3"
                >
                  {stateTypes.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Display Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    stateForm.displayOrder
                  }
                  onChange={(event) =>
                    setStateForm({
                      ...stateForm,
                      displayOrder:
                        Number(
                          event.target
                            .value,
                        ),
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3"
                />
              </div>

            </div>

            <Field
              label="Color"
              value={
                stateForm.color
              }
              onChange={(value) =>
                setStateForm({
                  ...stateForm,
                  color: value,
                })
              }
              placeholder="#2563EB"
            />

            <TextAreaField
              label="Description"
              value={
                stateForm.description
              }
              onChange={(value) =>
                setStateForm({
                  ...stateForm,
                  description:
                    value,
                })
              }
              placeholder="What does this state mean?"
            />

            <ModalActions
              onCancel={closeStateModal}
              saving={saving}
              submitLabel={
                editingState
                  ? "Save Changes"
                  : "Add State"
              }
            />

          </form>

        </Modal>
      )}

      {/* =======================================================
          CREATE / UPDATE TRANSITION MODAL
      ======================================================= */}

      {showTransitionModal && (
        <Modal
          title={
            editingTransition
              ? "Edit Workflow Transition"
              : "Add Workflow Transition"
          }
          onClose={
            closeTransitionModal
          }
        >

          <form
            onSubmit={
              handleSaveTransition
            }
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium mb-2">
                From State
              </label>

              <select
                value={
                  transitionForm.fromStateId
                }
                onChange={(event) =>
                  setTransitionForm({
                    ...transitionForm,
                    fromStateId:
                      event.target
                        .value,
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              >
                <option value="">
                  Select starting state...
                </option>

                {states.map(
                  (state) => (
                    <option
                      key={state.id}
                      value={state.id}
                    >
                      {state.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                To State
              </label>

              <select
                value={
                  transitionForm.toStateId
                }
                onChange={(event) =>
                  setTransitionForm({
                    ...transitionForm,
                    toStateId:
                      event.target
                        .value,
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              >
                <option value="">
                  Select destination state...
                </option>

                {states.map(
                  (state) => (
                    <option
                      key={state.id}
                      value={state.id}
                    >
                      {state.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <Field
              label="Action Label"
              value={
                transitionForm.actionLabel
              }
              onChange={(value) =>
                setTransitionForm({
                  ...transitionForm,
                  actionLabel:
                    value,
                })
              }
              placeholder="Start Consultation"
            />

            <Field
              label="Action Code"
              value={
                transitionForm.actionCode
              }
              onChange={(value) =>
                setTransitionForm({
                  ...transitionForm,
                  actionCode:
                    value,
                })
              }
              placeholder="START_CONSULTATION"
            />

            <Field
              label="Display Order"
              value={String(
                transitionForm.displayOrder,
              )}
              type="number"
              onChange={(value) =>
                setTransitionForm({
                  ...transitionForm,
                  displayOrder:
                    Number(value),
                })
              }
              placeholder="0"
            />

            <TextAreaField
              label="Description"
              value={
                transitionForm.description
              }
              onChange={(value) =>
                setTransitionForm({
                  ...transitionForm,
                  description:
                    value,
                })
              }
              placeholder="Describe what this action does..."
            />

            <ModalActions
              onCancel={
                closeTransitionModal
              }
              saving={saving}
              submitLabel={
                editingTransition
                  ? "Save Transition"
                  : "Add Transition"
              }
            />

          </form>

        </Modal>
      )}

    </div>
  );
}

/* =========================================================
   STATE ROW
========================================================= */

function StateRow({
  state,
  index,
  saving,
  onEdit,
  onDelete,
}: {
  state: WorkflowState;
  index: number;
  saving: boolean;
  onEdit: (state: WorkflowState) => void;
  onDelete: (state: WorkflowState) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-4">

      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {index + 1}
      </div>

      <div className="flex-1">
        <p className="font-medium">
          {state.name}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          {state.code}
        </p>
      </div>

      <span className="text-xs px-2.5 py-1 rounded-full bg-muted">
        {state.type}
      </span>

      <button
        type="button"
        onClick={() => onEdit(state)}
        disabled={saving}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => onDelete(state)}
        disabled={saving}
        className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
      >
        Delete
      </button>

    </div>
  );
}

/* =========================================================
   TRANSITION ROW
========================================================= */

function TransitionRow({
  transition,
  saving,
  onEdit,
  onDelete,
}: {
  transition: WorkflowTransition;
  saving: boolean;
  onEdit: (
    transition: WorkflowTransition,
  ) => void;
  onDelete: (
    transition: WorkflowTransition,
  ) => void;
}) {
  return (
    <div className="rounded-xl border border-border p-4">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 flex-wrap">

          <span className="rounded-lg bg-muted px-3 py-1.5 text-sm">
            {transition.fromState?.name ??
              transition.fromStateId}
          </span>

          <span className="text-muted-foreground">
            →
          </span>

          <span className="rounded-lg bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium">
            {transition.actionLabel}
          </span>

          <span className="text-muted-foreground">
            →
          </span>

          <span className="rounded-lg bg-muted px-3 py-1.5 text-sm">
            {transition.toState?.name ??
              transition.toStateId}
          </span>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              onEdit(transition)
            }
            disabled={saving}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(transition)
            }
            disabled={saving}
            className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            Delete
          </button>

        </div>

      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Action code:{" "}
        {transition.actionCode}
      </p>

    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="font-medium mt-1">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 resize-none"
      />
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-border">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({
  onCancel,
  saving,
  submitLabel,
}: {
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-border">

      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl bg-muted px-5 py-3"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : submitLabel}
      </button>

    </div>
  );
}
