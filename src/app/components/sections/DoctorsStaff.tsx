import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, Stethoscope, Users } from "lucide-react";
import { useHospitalContext } from "../../context/HospitalContext";
import { getStaff, type StaffMember } from "../../../services/staff.service";

export function DoctorsStaff() {
  const { currentHospital, isLoading: hospitalLoading } = useHospitalContext();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hospitalLoading) return;
    if (!currentHospital) { setStaff([]); setLoading(false); setError("Select an active hospital to view staff."); return; }
    void loadStaff();
  }, [currentHospital?.id, hospitalLoading]);

  async function loadStaff() {
    try { setLoading(true); setError(""); const data = await getStaff(); setStaff(data.filter((member) => member.hospitalId === currentHospital?.id)); }
    catch (loadError) { console.error(loadError); setError("Unable to load staff records."); }
    finally { setLoading(false); }
  }

  const visibleStaff = useMemo(() => {
    const term = search.trim().toLowerCase();
    return staff.filter((member) => !term || [name(member), member.employeeNumber, member.staffType, member.department?.name, member.doctorProfile?.specialization].filter(Boolean).join(" ").toLowerCase().includes(term));
  }, [search, staff]);
  const doctors = staff.filter((member) => member.doctorProfile).length;
  const nurses = staff.filter((member) => member.staffType === "NURSE").length;

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-foreground">Doctors & Staff</h1><p className="mt-2 text-muted-foreground">{currentHospital ? `Staff roster for ${currentHospital.name}` : "Select an active hospital to view the staff roster"}</p></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric label="All staff" value={staff.length} icon={Users} /><Metric label="Doctors" value={doctors} icon={Stethoscope} /><Metric label="Nurses" value={nurses} icon={Users} /></div>
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"><div className="border-b border-border p-4"><label className="relative block max-w-lg"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, employee number, role, or department" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label></div>{loading ? <State message="Loading staff records..." /> : error ? <State message={error} error /> : visibleStaff.length === 0 ? <State message="No staff records found for this hospital." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-muted/50 text-left text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Employee</th><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Department</th><th className="px-5 py-3 font-medium">Contact</th></tr></thead><tbody className="divide-y divide-border">{visibleStaff.map((member) => <tr key={member.id} className="hover:bg-muted/30"><td className="px-5 py-4 font-mono text-xs font-medium text-primary">{member.employeeNumber}</td><td className="px-5 py-4 font-medium">{name(member)}</td><td className="px-5 py-4"><p>{member.doctorProfile?.specialization || role(member.staffType)}</p>{member.doctorProfile && <p className="mt-1 text-xs text-muted-foreground">Doctor</p>}</td><td className="px-5 py-4 text-muted-foreground">{member.department?.name || "Unassigned"}</td><td className="px-5 py-4 text-muted-foreground">{member.personProfile.phoneNumber || "Not provided"}</td></tr>)}</tbody></table></div>}</section>
  </div>;
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) { return <div className="rounded-lg border border-border bg-card p-5 shadow-sm"><Icon className="mb-3 size-5 text-primary" /><p className="text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>; }
function State({ message, error = false }: { message: string; error?: boolean }) { return <div className={`flex min-h-52 items-center justify-center gap-2 px-5 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}><AlertCircle className="size-4" />{message}</div>; }
function name(member: StaffMember) { return [member.personProfile.firstName, member.personProfile.middleName, member.personProfile.lastName].filter(Boolean).join(" "); }
function role(value: string) { return value.toLowerCase().split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" "); }
