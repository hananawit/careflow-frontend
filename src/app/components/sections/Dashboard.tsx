import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, CalendarPlus, Loader2, RefreshCw, Stethoscope, UserPlus, Users } from "lucide-react";
import { getAppointments, type Appointment } from "../../../services/appointment.service";
import { getPatients, type Patient } from "../../../services/patient.service";
import { getStaff, type StaffMember } from "../../../services/staff.service";
import { useHospitalContext } from "../../context/HospitalContext";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentHospital } = useHospitalContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!currentHospital) {
      setAppointments([]);
      setPatients([]);
      setStaff([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [appointmentData, patientData, staffData] = await Promise.all([
        getAppointments(),
        getPatients("", currentHospital.id),
        getStaff(),
      ]);
      setAppointments(appointmentData.filter((item) => item.hospitalId === currentHospital.id));
      setPatients(patientData);
      setStaff(staffData.filter((item) => item.hospitalId === currentHospital.id));
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [currentHospital]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const todayAppointments = useMemo(
    () => appointments.filter((item) => isToday(item.appointmentDate)),
    [appointments],
  );
  const activeEncounters = useMemo(
    () => appointments.filter((item) => item.encounter?.status === "IN_PROGRESS"),
    [appointments],
  );
  const triageQueue = useMemo(
    () => activeEncounters.filter((item) => !hasTriage(item)),
    [activeEncounters],
  );
  const consultationQueue = useMemo(
    () => activeEncounters.filter((item) => !item.encounter?.consultation),
    [activeEncounters],
  );
  const upcomingAppointments = useMemo(
    () => [...todayAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime)).slice(0, 6),
    [todayAppointments],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="mt-1 text-muted-foreground">{currentHospital ? `${currentHospital.name} · ${new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}` : "Select an active hospital to view operations."}</p>
        </div>
        <button type="button" onClick={() => void loadDashboard()} disabled={loading} aria-label="Refresh dashboard" className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"><RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} /></button>
      </div>

      {error && <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" />{error}</div>}

      {!currentHospital ? <EmptyState message="Select an active hospital to view the operational dashboard." /> : loading ? <LoadingState /> : <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={CalendarPlus} label="Today's appointments" value={todayAppointments.length} note={`${todayAppointments.filter((item) => item.status === "SCHEDULED").length} scheduled`} color="primary" />
          <Metric icon={Activity} label="Active encounters" value={activeEncounters.length} note="Currently in care" color="info" />
          <Metric icon={Stethoscope} label="Awaiting triage" value={triageQueue.length} note="Active encounter queue" color="warning" />
          <Metric icon={Users} label="Registered patients" value={patients.length} note={`${staff.length} staff members`} color="success" />
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          <QuickAction icon={UserPlus} label="Register patient" onClick={() => onNavigate("patients")} />
          <QuickAction icon={CalendarPlus} label="Book appointment" onClick={() => onNavigate("appointments")} />
          <QuickAction icon={Stethoscope} label="Open triage queue" onClick={() => onNavigate("triage")} />
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-semibold text-foreground">Today's appointments</h2><button type="button" onClick={() => onNavigate("appointments")} className="text-sm font-medium text-primary hover:underline">View appointments</button></div>
            {upcomingAppointments.length === 0 ? <ListEmpty message="No appointments scheduled for today." /> : <div className="divide-y divide-border">{upcomingAppointments.map((item) => <AppointmentRow key={item.id} appointment={item} />)}</div>}
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4"><h2 className="font-semibold text-foreground">Clinical queues</h2></div>
            <div className="divide-y divide-border">
              <QueueRow label="Ready for triage" value={triageQueue.length} onClick={() => onNavigate("triage")} />
              <QueueRow label="Ready for consultation" value={consultationQueue.length} onClick={() => onNavigate("consultation")} />
              <QueueRow label="In-progress encounters" value={activeEncounters.length} onClick={() => onNavigate("encounter")} />
            </div>
          </section>
        </div>
      </>}
    </div>
  );
}

function Metric({ icon: Icon, label, value, note, color }: { icon: React.ElementType; label: string; value: number; note: string; color: "primary" | "info" | "warning" | "success" }) {
  const colors = { primary: "bg-primary/10 text-primary", info: "bg-info/10 text-info", warning: "bg-warning/10 text-warning", success: "bg-success/10 text-success" };
  return <section className="rounded-lg border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold text-foreground">{value}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></div><div className={`rounded-md p-2.5 ${colors[color]}`}><Icon className="size-5" /></div></div></section>;
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4 text-left shadow-sm hover:bg-muted/40"><Icon className="size-5 text-primary" /><span className="text-sm font-medium text-foreground">{label}</span></button>;
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const person = appointment.patientHospital?.patientProfile?.personProfile;
  const name = person ? [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ") : "Patient record";
  return <div className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="font-medium text-foreground">{name}</p><p className="mt-1 text-sm text-muted-foreground">{appointment.appointmentType.replaceAll("_", " ")} · {appointment.patientHospital?.medicalRecordNumber ?? "No MRN"}</p></div><div className="text-right"><p className="text-sm font-medium text-foreground">{formatTime(appointment.startTime)}</p><Status status={appointment.status} /></div></div>;
}

function QueueRow({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-muted/40"><span className="text-sm text-foreground">{label}</span><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{value}</span></button>;
}

function Status({ status }: { status: string }) {
  const colors: Record<string, string> = { SCHEDULED: "bg-muted text-muted-foreground", CHECKED_IN: "bg-warning/10 text-warning", IN_PROGRESS: "bg-primary/10 text-primary", COMPLETED: "bg-success/10 text-success", CANCELLED: "bg-destructive/10 text-destructive" };
  return <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-muted text-muted-foreground"}`}>{status.replaceAll("_", " ")}</span>;
}

function LoadingState() { return <div className="flex min-h-80 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading dashboard...</div>; }
function EmptyState({ message }: { message: string }) { return <div className="flex min-h-80 items-center justify-center rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">{message}</div>; }
function ListEmpty({ message }: { message: string }) { return <div className="p-10 text-center text-sm text-muted-foreground">{message}</div>; }
function hasTriage(appointment: Appointment) { return Array.isArray(appointment.triage) ? appointment.triage.length > 0 : Boolean(appointment.triage); }
function isToday(value: string) { const date = new Date(value); const today = new Date(); return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate(); }
function formatTime(value: string) { return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
