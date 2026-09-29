import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, Download, FileText, Loader2, RefreshCw, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAppointments, type Appointment } from "../../../services/appointment.service";
import { getPatients, type Patient } from "../../../services/patient.service";
import { useHospitalContext } from "../../context/HospitalContext";

export function Reports() {
  const { currentHospital } = useHospitalContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    if (!currentHospital) {
      setAppointments([]); setPatients([]); setLoading(false); return;
    }
    try {
      setLoading(true); setError("");
      const [appointmentData, patientData] = await Promise.all([getAppointments(), getPatients("", currentHospital.id)]);
      setAppointments(appointmentData.filter((item) => item.hospitalId === currentHospital.id));
      setPatients(patientData);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "Unable to load operational reports.");
    } finally { setLoading(false); }
  }, [currentHospital]);

  useEffect(() => { void loadReports(); }, [loadReports]);

  const statusData = useMemo(() => ["SCHEDULED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"].map((status) => ({ status: status.replaceAll("_", " "), count: appointments.filter((item) => item.status === status).length })), [appointments]);
  const lastSevenDays = useMemo(() => recentDays(appointments), [appointments]);
  const completed = appointments.filter((item) => item.status === "COMPLETED").length;
  const completionRate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;
  const activeEncounters = appointments.filter((item) => item.encounter?.status === "IN_PROGRESS").length;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold text-foreground">Operational Reports</h1><p className="mt-1 text-muted-foreground">Appointment and patient activity for {currentHospital?.name ?? "the selected hospital"}.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => void loadReports()} disabled={loading} aria-label="Refresh reports" className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted disabled:opacity-50"><RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} /></button><button type="button" onClick={() => exportAppointments(appointments, currentHospital?.name)} disabled={!appointments.length} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"><Download className="size-4" />Export appointments</button></div>
    </div>

    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
    {!currentHospital ? <Empty message="Select an active hospital to view reports." /> : loading ? <Empty message="Loading operational reports..." loading /> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={Users} label="Registered patients" value={patients.length} color="teal" /><Stat icon={CalendarDays} label="All appointments" value={appointments.length} color="blue" /><Stat icon={FileText} label="Completion rate" value={`${completionRate}%`} color="green" /><Stat icon={BarChart3} label="Active encounters" value={activeEncounters} color="amber" /></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Appointments by status"><ResponsiveContainer width="100%" height={300}><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="#dbe4ea" /><XAxis dataKey="status" tick={{ fontSize: 11, fill: "#64748b" }} interval={0} /><YAxis allowDecimals={false} tick={{ fill: "#64748b" }} /><Tooltip /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{statusData.map((item) => <Cell key={item.status} fill={statusColor(item.status)} />)}</Bar></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Appointments in the last 7 days"><ResponsiveContainer width="100%" height={300}><BarChart data={lastSevenDays}><CartesianGrid strokeDasharray="3 3" stroke="#dbe4ea" /><XAxis dataKey="day" tick={{ fill: "#64748b" }} /><YAxis allowDecimals={false} tick={{ fill: "#64748b" }} /><Tooltip /><Bar dataKey="appointments" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"><div className="border-b border-border px-5 py-4"><h2 className="font-semibold text-foreground">Report scope</h2></div><div className="grid gap-4 p-5 md:grid-cols-3"><Scope label="Patient registrations" value={patients.length} detail="Current hospital records" /><Scope label="Completed appointments" value={completed} detail="Across available appointment history" /><Scope label="Clinical workload" value={activeEncounters} detail="Encounters currently in progress" /></div></section>
    </>}
  </div>;
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: "teal" | "blue" | "green" | "amber" }) { const colors = { teal: "bg-teal-50 text-teal-700", blue: "bg-sky-50 text-sky-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" }; return <section className="flex items-start justify-between rounded-lg border border-border bg-card p-5 shadow-sm"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold text-foreground">{value}</p></div><div className={`rounded-md p-2.5 ${colors[color]}`}><Icon className="size-5" /></div></section>; }
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border border-border bg-card p-5 shadow-sm"><h2 className="mb-5 font-semibold text-foreground">{title}</h2>{children}</section>; }
function Scope({ label, value, detail }: { label: string; value: number; detail: string }) { return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>; }
function Empty({ message, loading = false }: { message: string; loading?: boolean }) { return <div className="flex min-h-80 items-center justify-center gap-2 rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">{loading && <Loader2 className="size-4 animate-spin" />}{message}</div>; }

function recentDays(appointments: Appointment[]) { return Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); const key = localDateKey(date); return { day: date.toLocaleDateString(undefined, { weekday: "short" }), appointments: appointments.filter((item) => localDateKey(new Date(item.appointmentDate)) === key).length }; }); }
function localDateKey(date: Date) { return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }
function statusColor(status: string) { const colors: Record<string, string> = { SCHEDULED: "#64748b", CHECKED_IN: "#d97706", IN_PROGRESS: "#0284c7", COMPLETED: "#059669", CANCELLED: "#dc2626", NO_SHOW: "#7c3aed" }; return colors[status.replaceAll(" ", "_")] ?? "#0f766e"; }
function exportAppointments(appointments: Appointment[], hospitalName?: string) { const rows = [["Hospital", "Appointment date", "Start time", "Patient", "MRN", "Type", "Status"], ...appointments.map((item) => [hospitalName ?? "", formatCsvDate(item.appointmentDate), formatCsvTime(item.startTime), item.patientHospital?.patientProfile?.personProfile ? [item.patientHospital.patientProfile.personProfile.firstName, item.patientHospital.patientProfile.personProfile.lastName].filter(Boolean).join(" ") : "", item.patientHospital?.medicalRecordNumber ?? "", item.appointmentType.replaceAll("_", " "), item.status.replaceAll("_", " ")])]; const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); link.download = "careflow-appointments-report.csv"; link.click(); URL.revokeObjectURL(link.href); }
function formatCsvDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }); }
function formatCsvTime(value: string) { return new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); }
