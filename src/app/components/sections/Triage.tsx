import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Stethoscope } from "lucide-react";
import { getAppointments, type Appointment } from "../../../services/appointment.service";
import { getStaff, type StaffMember } from "../../../services/staff.service";
import { createTriage, type CreateTriageDto } from "../../../services/triage.service";
import { useHospitalContext } from "../../context/HospitalContext";

type NumericField = Exclude<keyof CreateTriageDto, "appointmentId" | "nurseId" | "chiefComplaint" | "priority" | "notes">;

const priorities = [
  ["EMERGENCY", "Emergency"],
  ["VERY_URGENT", "Very urgent"],
  ["URGENT", "Urgent"],
  ["STANDARD", "Standard"],
  ["NON_URGENT", "Non-urgent"],
] as const;

export function Triage() {
  const { currentHospital } = useHospitalContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nurses, setNurses] = useState<StaffMember[]>([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<CreateTriageDto>({ chiefComplaint: "", priority: "STANDARD" });

  useEffect(() => {
    void loadContext();
  }, [currentHospital?.id]);

  async function loadContext() {
    if (!currentHospital) {
      setAppointments([]);
      setNurses([]);
      setLoadingContext(false);
      return;
    }

    try {
      setLoadingContext(true);
      setError("");
      const [appointmentData, staffData] = await Promise.all([getAppointments(), getStaff()]);
      setAppointments(appointmentData.filter((appointment) => appointment.hospitalId === currentHospital.id));
      setNurses(staffData.filter((staff) => staff.hospitalId === currentHospital.id && staff.staffType === "NURSE"));
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "Unable to load triage context.");
    } finally {
      setLoadingContext(false);
    }
  }

  const readyAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.encounter?.status === "IN_PROGRESS" && !hasTriage(appointment)),
    [appointments],
  );

  function changeText(field: "appointmentId" | "nurseId" | "chiefComplaint" | "notes", value: string) {
    setForm((previous) => ({ ...previous, [field]: value || undefined }));
  }

  function changeNumber(field: NumericField, value: string) {
    setForm((previous) => ({ ...previous, [field]: value === "" ? undefined : Number(value) }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.appointmentId || !form.nurseId || !form.chiefComplaint?.trim()) {
      setError("Select an encounter and nurse, then enter the chief complaint.");
      return;
    }
    if (form.painScore !== undefined && (form.painScore < 0 || form.painScore > 10)) {
      setError("Pain score must be between 0 and 10.");
      return;
    }
    if (form.oxygenSaturation !== undefined && (form.oxygenSaturation < 0 || form.oxygenSaturation > 100)) {
      setError("Oxygen saturation must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);
      const result = await createTriage({ ...form, chiefComplaint: form.chiefComplaint.trim(), notes: form.notes?.trim() || undefined });
      setSuccess(result.bmi === null ? "Triage saved successfully." : `Triage saved successfully. BMI: ${result.bmi}.`);
      setAppointments((previous) => previous.filter((appointment) => appointment.id !== form.appointmentId));
      setForm({ chiefComplaint: "", priority: "STANDARD" });
    } catch (saveError) {
      console.error(saveError);
      setError(saveError instanceof Error ? saveError.message : "Unable to save triage.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Triage</h1>
        <p className="mt-1 text-muted-foreground">Capture vital signs and priority for patients with active encounters.</p>
      </div>

      {error && <Notice type="error" message={error} />}
      {success && <Notice type="success" message={success} />}

      <form onSubmit={submit} className="max-w-5xl rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-semibold text-foreground">Clinical assessment</h2>
        </div>

        {loadingContext ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading triage queue...</div>
        ) : !currentHospital ? (
          <EmptyState message="Select an active hospital to begin triage." />
        ) : readyAppointments.length === 0 ? (
          <EmptyState message="No active encounters are waiting for triage." />
        ) : nurses.length === 0 ? (
          <EmptyState message="Register a nurse for this hospital before recording triage." />
        ) : (
          <div className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Encounter *" value={form.appointmentId ?? ""} onChange={(value) => changeText("appointmentId", value)} placeholder="Select active encounter">
                {readyAppointments.map((appointment) => <option key={appointment.id} value={appointment.id}>{patientName(appointment)} · {appointment.patientHospital?.medicalRecordNumber ?? "No MRN"}</option>)}
              </SelectField>
              <SelectField label="Recording nurse *" value={form.nurseId ?? ""} onChange={(value) => changeText("nurseId", value)} placeholder="Select nurse">
                {nurses.map((nurse) => <option key={nurse.id} value={nurse.id}>{staffName(nurse)} · {nurse.employeeNumber}</option>)}
              </SelectField>
            </div>

            <label className="block text-sm font-medium text-foreground">Chief complaint *
              <textarea value={form.chiefComplaint} onChange={(event) => changeText("chiefComplaint", event.target.value)} required rows={3} placeholder="Presenting concern or symptoms" className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-foreground">Vital signs</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField label="Systolic BP" suffix="mmHg" value={form.systolicBP} onChange={(value) => changeNumber("systolicBP", value)} />
                <NumberField label="Diastolic BP" suffix="mmHg" value={form.diastolicBP} onChange={(value) => changeNumber("diastolicBP", value)} />
                <NumberField label="Pulse" suffix="bpm" value={form.pulse} onChange={(value) => changeNumber("pulse", value)} />
                <NumberField label="Respiratory rate" suffix="/min" value={form.respiratoryRate} onChange={(value) => changeNumber("respiratoryRate", value)} />
                <NumberField label="Temperature" suffix="°C" step="0.1" value={form.temperature} onChange={(value) => changeNumber("temperature", value)} />
                <NumberField label="Oxygen saturation" suffix="%" min="0" max="100" value={form.oxygenSaturation} onChange={(value) => changeNumber("oxygenSaturation", value)} />
                <NumberField label="Weight" suffix="kg" step="0.1" min="0" value={form.weight} onChange={(value) => changeNumber("weight", value)} />
                <NumberField label="Height" suffix="m" step="0.01" min="0" value={form.height} onChange={(value) => changeNumber("height", value)} />
                <NumberField label="Pain score" suffix="/10" min="0" max="10" value={form.painScore} onChange={(value) => changeNumber("painScore", value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Priority *" value={form.priority} onChange={(value) => setForm((previous) => ({ ...previous, priority: value as CreateTriageDto["priority"] }))}>
                {priorities.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </SelectField>
              <label className="block text-sm font-medium text-foreground">Notes
                <textarea value={form.notes ?? ""} onChange={(event) => changeText("notes", event.target.value)} rows={3} placeholder="Observations or handover notes" className="mt-2 w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
            </div>

            <div className="flex justify-end border-t border-border pt-5">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                {saving && <Loader2 className="size-4 animate-spin" />}{saving ? "Saving..." : "Save triage"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function hasTriage(appointment: Appointment) {
  return Array.isArray(appointment.triage) ? appointment.triage.length > 0 : Boolean(appointment.triage);
}

function patientName(appointment: Appointment) {
  const person = appointment.patientHospital?.patientProfile?.personProfile;
  return person ? [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ") : "Patient record";
}

function staffName(staff: StaffMember) {
  return [staff.personProfile.firstName, staff.personProfile.middleName, staff.personProfile.lastName].filter(Boolean).join(" ");
}

function Notice({ type, message }: { type: "error" | "success"; message: string }) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  const colors = type === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-success/30 bg-success/10 text-success";
  return <div role={type === "error" ? "alert" : "status"} className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${colors}`}><Icon className="size-4 shrink-0" />{message}</div>;
}

function EmptyState({ message }: { message: string }) {
  return <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground"><Stethoscope className="size-5" /><p className="text-sm">{message}</p></div>;
}

function SelectField({ label, value, onChange, children, placeholder }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; placeholder?: string }) {
  return <label className="block text-sm font-medium text-foreground">{label}<select value={value} onChange={(event) => onChange(event.target.value)} required className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">{placeholder ?? "Select..."}</option>{children}</select></label>;
}

function NumberField({ label, suffix, value, onChange, step = "1", min, max }: { label: string; suffix: string; value?: number; onChange: (value: string) => void; step?: string; min?: string; max?: string }) {
  return <label className="block text-sm font-medium text-foreground">{label}<span className="ml-1 font-normal text-muted-foreground">{suffix}</span><input type="number" value={value ?? ""} step={step} min={min} max={max} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>;
}
