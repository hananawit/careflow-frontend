import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  createConsultation,
  type ConsultationStatus,
} from "../../../services/consultation.service";

import {
  getAppointment,
  type Appointment,
} from "../../../services/appointment.service";

export function Consultation() {
  const [searchParams] = useSearchParams();

  const appointmentId = searchParams.get("appointmentId");
  const encounterIdFromUrl = searchParams.get("encounterId");

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] =
    useState(true);

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    physicalExamination: "",
    assessment: "",
    treatmentPlan: "",
    followUpInstructions: "",
  });

  useEffect(() => {
    if (!appointmentId) {
      setLoadingAppointment(false);
      return;
    }

    loadAppointment();
  }, [appointmentId]);

  async function loadAppointment() {
    try {
      setLoadingAppointment(true);
      setMessage("");

      const data = await getAppointment(appointmentId!);

      setAppointment(data);

      /*
       * If triage already captured a chief complaint,
       * use it as the initial consultation value.
       */
      if (data.triage?.chiefComplaint) {
        setForm((previous) => ({
          ...previous,
          chiefComplaint:
            previous.chiefComplaint ||
            data.triage?.chiefComplaint ||
            "",
        }));
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Failed to load appointment information.",
      );
    } finally {
      setLoadingAppointment(false);
    }
  }

  function handleChange(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  const encounterId = useMemo(() => {
    /*
     * Prefer the encounter explicitly supplied in the URL.
     * Otherwise use the encounter attached to the appointment.
     */
    return (
      encounterIdFromUrl ||
      appointment?.encounter?.id ||
      null
    );
  }, [encounterIdFromUrl, appointment]);

  const existingConsultation =
    appointment?.encounter?.consultation;

  const patientName = appointment?.patientHospital
    ?.patientProfile?.personProfile
    ? getFullName(
        appointment.patientHospital.patientProfile
          .personProfile,
      )
    : "Patient";

  const doctorName = appointment?.doctorProfile
    ?.staffProfile?.personProfile
    ? getFullName(
        appointment.doctorProfile.staffProfile
          .personProfile,
      )
    : "Doctor";

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!appointment) {
      setMessage(
        "Appointment information is missing.",
      );
      return;
    }

    if (!encounterId) {
      setMessage(
        "No encounter is available for this appointment.",
      );
      return;
    }

    if (existingConsultation) {
      setMessage(
        "A consultation already exists for this encounter.",
      );
      return;
    }

    if (!form.chiefComplaint.trim()) {
      setMessage(
        "Chief complaint is required.",
      );
      return;
    }

    if (!appointment.doctorProfileId) {
      setMessage(
        "Doctor information is missing.",
      );
      return;
    }

    if (!appointment.patientHospitalId) {
      setMessage(
        "Patient registration information is missing.",
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createConsultation({
        encounterId,

        doctorProfileId:
          appointment.doctorProfileId,

        patientHospitalId:
          appointment.patientHospitalId,

        status:
          "IN_PROGRESS" as ConsultationStatus,

        chiefComplaint:
          form.chiefComplaint.trim(),

        historyOfPresentIllness:
          optionalValue(
            form.historyOfPresentIllness,
          ),

        physicalExamination:
          optionalValue(
            form.physicalExamination,
          ),

        assessment:
          optionalValue(form.assessment),

        treatmentPlan:
          optionalValue(form.treatmentPlan),

        followUpInstructions:
          optionalValue(
            form.followUpInstructions,
          ),
      });

      setMessage(
        "Consultation saved successfully.",
      );

      /*
       * Reload the appointment so the frontend
       * knows that a consultation now exists.
       */
      await loadAppointment();
    } catch (error) {
      console.error(error);

      setMessage(
        getErrorMessage(
          error,
          "Failed to save consultation.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  if (!appointmentId) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            No patient selected
          </h2>

          <p className="text-muted-foreground mt-2">
            Start the consultation from the
            checked-in appointment.
          </p>
        </div>
      </div>
    );
  }

  if (loadingAppointment) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Consultation
          </h1>

          <p className="text-muted-foreground mt-1">
            Loading appointment information...
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">
            Loading patient information...
          </p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            Appointment not found
          </h2>

          <p className="text-muted-foreground mt-2">
            The selected appointment could not be loaded.
          </p>

          {message && (
            <div className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Consultation
        </h1>

        <p className="text-muted-foreground mt-1">
          Doctor consultation and clinical assessment
        </p>
      </div>

      {/* Patient / Appointment Summary */}
      <div className="bg-card border border-border rounded-2xl p-6">

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Patient
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              {patientName}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              MRN:{" "}
              {appointment.patientHospital
                ?.medicalRecordNumber ||
                appointment.patientHospitalId}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Encounter
            </p>

            <p className="font-medium mt-1">
              {appointment.encounter?.encounterType ||
                "Not available"}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              {appointment.encounter?.status ||
                "Not available"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <InfoItem
            label="Doctor"
            value={doctorName}
          />

          <InfoItem
            label="Appointment Type"
            value={appointment.appointmentType}
          />

          <InfoItem
            label="Date"
            value={formatDate(
              appointment.appointmentDate,
            )}
          />

          <InfoItem
            label="Time"
            value={`${formatTime(
              appointment.startTime,
            )} - ${formatTime(
              appointment.endTime,
            )}`}
          />
        </div>

        {appointment.reason && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Appointment Reason
            </p>

            <p className="mt-1 text-sm">
              {appointment.reason}
            </p>
          </div>
        )}
      </div>

      {/* Existing Consultation */}
      {existingConsultation && (
        <div className="rounded-2xl border border-border bg-muted px-5 py-4">
          <p className="font-medium">
            Consultation already exists
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            This encounter already has a consultation
            with status{" "}
            <span className="font-medium">
              {existingConsultation.status}
            </span>
            .
          </p>
        </div>
      )}

      {/* Triage Summary */}
      {appointment.triage && (
        <div className="bg-card border border-border rounded-2xl p-6">

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Triage Summary
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Information recorded during patient triage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {appointment.triage.priority && (
              <InfoItem
                label="Priority"
                value={appointment.triage.priority}
              />
            )}

            {appointment.triage.painScore !==
              null &&
              appointment.triage.painScore !==
                undefined && (
                <InfoItem
                  label="Pain Score"
                  value={`${appointment.triage.painScore}/10`}
                />
              )}

            {appointment.triage.chiefComplaint && (
              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground">
                  Triage Chief Complaint
                </p>

                <p className="mt-1 text-sm">
                  {appointment.triage.chiefComplaint}
                </p>
              </div>
            )}

            {appointment.triage.notes && (
              <div className="md:col-span-3">
                <p className="text-sm text-muted-foreground">
                  Triage Notes
                </p>

                <p className="mt-1 text-sm">
                  {appointment.triage.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consultation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-6 space-y-6"
      >
        <div>
          <h2 className="text-lg font-semibold">
            Clinical Assessment
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Record the patient's clinical findings,
            assessment, and treatment plan.
          </p>
        </div>

        <TextAreaField
          label="Chief Complaint"
          value={form.chiefComplaint}
          onChange={(value) =>
            handleChange(
              "chiefComplaint",
              value,
            )
          }
          rows={3}
          required
          placeholder="What is the patient complaining about?"
        />

        <TextAreaField
          label="History of Present Illness"
          value={form.historyOfPresentIllness}
          onChange={(value) =>
            handleChange(
              "historyOfPresentIllness",
              value,
            )
          }
          rows={5}
          placeholder="Describe the history of the current illness..."
        />

        <TextAreaField
          label="Physical Examination"
          value={form.physicalExamination}
          onChange={(value) =>
            handleChange(
              "physicalExamination",
              value,
            )
          }
          rows={5}
          placeholder="Record physical examination findings..."
        />

        <TextAreaField
          label="Assessment"
          value={form.assessment}
          onChange={(value) =>
            handleChange(
              "assessment",
              value,
            )
          }
          rows={5}
          placeholder="Clinical assessment and diagnosis..."
        />

        <TextAreaField
          label="Treatment Plan"
          value={form.treatmentPlan}
          onChange={(value) =>
            handleChange(
              "treatmentPlan",
              value,
            )
          }
          rows={5}
          placeholder="Medication, treatment, procedures, or other clinical plan..."
        />

        <TextAreaField
          label="Follow-up Instructions"
          value={form.followUpInstructions}
          onChange={(value) =>
            handleChange(
              "followUpInstructions",
              value,
            )
          }
          rows={4}
          placeholder="Follow-up date, instructions, referrals, or precautions..."
        />

        {/* Message */}
        {message && (
          <div className="rounded-xl bg-muted px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">

          <button
            type="button"
            onClick={() =>
              setMessage(
                "Draft saving will be added next.",
              )
            }
            disabled={loading}
            className="px-6 py-3 bg-muted text-foreground rounded-xl disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              Boolean(existingConsultation)
            }
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : existingConsultation
                ? "Consultation Saved"
                : "Save Consultation"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
  required?: boolean;
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  placeholder,
  required = false,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}

        {required && (
          <span className="text-destructive ml-1">
            *
          </span>
        )}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
        placeholder={placeholder}
      />
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="font-medium mt-1">
        {value || "—"}
      </p>
    </div>
  );
}

function getFullName(
  person: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
  },
) {
  return [
    person.firstName,
    person.middleName,
    person.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

function optionalValue(
  value: string,
): string | undefined {
  const trimmed = value.trim();

  return trimmed || undefined;
}

function formatDate(
  value: string,
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

function formatTime(
  value: string,
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}