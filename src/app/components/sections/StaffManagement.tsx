import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Plus, Search } from "lucide-react";
import { getStaff, type StaffMember } from "../../../services/staff.service";
import { useHospitalContext } from "../../context/HospitalContext";
import { RegisterStaffDialog } from "./RegisterStaffDialog";

interface StaffManagementProps {
  onBack: () => void;
}

export function StaffManagement({ onBack }: StaffManagementProps) {
  const { currentHospital } = useHospitalContext();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const loadStaff = useCallback(async () => {
    if (!currentHospital) { setStaff([]); setLoading(false); setError("No active hospital selected."); return; }
    try { setLoading(true); setError(""); const data = await getStaff(); setStaff(data.filter((m) => m.hospitalId === currentHospital.id)); }
    catch (e) { console.error(e); setError("Unable to load staff records."); }
    finally { setLoading(false); }
  }, [currentHospital]);

  useEffect(() => { void loadStaff(); }, [loadStaff]);

  const visibleStaff = useMemo(() => {
    const term = search.trim().toLowerCase();
    return staff.filter((m) => !term || [name(m), m.employeeNumber, m.staffType, m.department?.name, m.doctorProfile?.specialization].filter(Boolean).join(" ").toLowerCase().includes(term));
  }, [search, staff]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onBack} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Back to settings"><ArrowLeft className="size-5" /></button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Doctors & Staff</h1>
            <p className="mt-2 text-muted-foreground">{currentHospital ? `Manage staff for ${currentHospital.name}` : "Select an active hospital to manage staff"}</p>
          </div>
        </div>
        {currentHospital && (
          <button onClick={() => setShowRegister(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4" />Register Staff
          </button>
        )}
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <label className="relative block max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, employee number, role, or department" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
        </div>
        {loading ? <State message="Loading staff records..." /> : error ? <State message={error} error /> : visibleStaff.length === 0 ? <State message={search ? "No staff match your search." : 'No staff registered yet. Click "Register Staff" to add the first member.'} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr><th className="px-5 py-3 font-medium">Employee</th><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Department</th><th className="px-5 py-3 font-medium">Contact</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleStaff.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4 font-mono text-xs font-medium text-primary">{m.employeeNumber}</td>
                    <td className="px-5 py-4 font-medium">{name(m)}</td>
                    <td className="px-5 py-4"><p>{m.doctorProfile?.specialization || role(m.staffType)}</p>{m.doctorProfile && <p className="mt-1 text-xs text-muted-foreground">Doctor</p>}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.department?.name || "Unassigned"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.personProfile.phoneNumber || "Not provided"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showRegister && (
        <RegisterStaffDialog onClose={() => setShowRegister(false)} onSaved={() => { setShowRegister(false); void loadStaff(); }} />
      )}
    </div>
  );
}

function State({ message, error = false }: { message: string; error?: boolean }) {
  return <div className={`flex min-h-52 items-center justify-center gap-2 px-5 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}><AlertCircle className="size-4" />{message}</div>;
}

function name(member: StaffMember) {
  return [member.personProfile.firstName, member.personProfile.middleName, member.personProfile.lastName].filter(Boolean).join(" ");
}

function role(value: string) {
  return value.toLowerCase().split("_").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
}
