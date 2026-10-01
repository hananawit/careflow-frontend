import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, Loader2, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../auth/AuthProvider";
import { getRoles, getUsers, updateUser, type CareFlowUser, type Role, type UserStatus } from "../../../services/users.service";

interface UserManagementProps {
  onBack: () => void;
}

const STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export function UserManagement({ onBack }: UserManagementProps) {
  const { permissions } = useAuth();
  const canUpdate = permissions.includes("users.update");
  const [users, setUsers] = useState<CareFlowUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selected, setSelected] = useState<CareFlowUser | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [result, availableRoles] = await Promise.all([
        getUsers({ page, limit: 20, search, status }),
        getRoles(),
      ]);
      setUsers(result.items);
      setTotal(result.total);
      setRoles(availableRoles);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load user accounts.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { void load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 20));

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onBack} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Back to settings"><ArrowLeft className="size-5" /></button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-muted-foreground">Manage CareFlow account status and role assignments.</p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <form onSubmit={submitSearch} className="flex flex-wrap gap-3 border-b border-border p-4">
          <label className="relative min-w-60 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <select value={status} onChange={(event) => { setStatus(event.target.value as UserStatus | ""); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Filter by account status">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
          <button className="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Search</button>
        </form>

        {loading ? <State message="Loading user accounts..." /> : error ? <State message={error} error /> : users.length === 0 ? <State message="No user accounts match the current filters." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground"><tr><th className="px-5 py-3 font-medium">User</th><th className="px-5 py-3 font-medium">Roles</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Last updated</th><th className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => <tr key={user.id} className="hover:bg-muted/30"><td className="px-5 py-4"><p className="font-medium text-foreground">{displayName(user)}</p><p className="mt-1 text-xs text-muted-foreground">{user.email}</p></td><td className="px-5 py-4 text-muted-foreground">{user.roles.map((role) => role.name).join(", ") || "No roles"}</td><td className="px-5 py-4"><StatusBadge status={user.status} /></td><td className="px-5 py-4 text-muted-foreground">{new Date(user.updatedAt).toLocaleDateString()}</td><td className="px-5 py-4 text-right">{canUpdate && <button type="button" onClick={() => setSelected(user)} className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10">Edit</button>}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground"><span>{total} account{total === 1 ? "" : "s"}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1 || loading} className="rounded-md p-2 hover:bg-muted disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="size-4" /></button><span>Page {page} of {totalPages}</span><button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages || loading} className="rounded-md p-2 hover:bg-muted disabled:opacity-40" aria-label="Next page"><ChevronRight className="size-4" /></button></div></div>
      </section>

      {selected && <EditUserDialog user={selected} roles={roles} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); void load(); }} />}
    </div>
  );
}

function EditUserDialog({ user, roles, onClose, onSaved }: { user: CareFlowUser; roles: Role[]; onClose: () => void; onSaved: () => void }) {
  const [firstName, setFirstName] = useState(user.personProfile?.firstName ?? "");
  const [lastName, setLastName] = useState(user.personProfile?.lastName ?? "");
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [roleIds, setRoleIds] = useState(() => user.roles.map((role) => role.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hasProfile = Boolean(user.personProfile);
  const selectedRoleIds = useMemo(() => new Set(roleIds), [roleIds]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateUser(user.id, {
        status,
        roleIds,
        ...(hasProfile ? { firstName: firstName.trim(), lastName: lastName.trim() } : {}),
      });
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update the account.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-user-title"><form onSubmit={save} className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-xl"><div className="border-b border-border px-6 py-4"><h2 id="edit-user-title" className="text-xl font-semibold text-foreground">Edit account</h2><p className="mt-1 text-sm text-muted-foreground">{user.email}</p></div><div className="space-y-5 p-6">{hasProfile && <div className="grid grid-cols-2 gap-4"><Field label="First name" value={firstName} onChange={setFirstName} /><Field label="Last name" value={lastName} onChange={setLastName} /></div>}<label className="block text-sm font-medium text-foreground">Account status<select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring">{STATUS_OPTIONS.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label><fieldset><legend className="flex items-center gap-2 text-sm font-medium text-foreground"><ShieldCheck className="size-4" />Roles</legend><div className="mt-3 grid gap-2">{roles.map((role) => <label key={role.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted/50"><input type="checkbox" checked={selectedRoleIds.has(role.id)} onChange={() => setRoleIds((current) => selectedRoleIds.has(role.id) ? current.filter((id) => id !== role.id) : [...current, role.id])} className="mt-0.5 size-4" /><span><span className="font-medium text-foreground">{role.name}</span>{role.description && <span className="mt-1 block text-xs text-muted-foreground">{role.description}</span>}</span></label>)}</div></fieldset>{error && <p role="alert" className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="size-4" />{error}</p>}</div><div className="flex justify-end gap-3 border-t border-border px-6 py-4"><button type="button" onClick={onClose} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{saving && <Loader2 className="size-4 animate-spin" />}{saving ? "Saving..." : "Save changes"}</button></div></form></div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-medium text-foreground">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>; }
function State({ message, error = false }: { message: string; error?: boolean }) { return <div className={`flex min-h-52 items-center justify-center gap-2 px-5 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}><AlertCircle className="size-4" />{message}</div>; }
function StatusBadge({ status }: { status: UserStatus }) { const colors: Record<UserStatus, string> = { ACTIVE: "bg-success/15 text-success", INACTIVE: "bg-muted text-muted-foreground", SUSPENDED: "bg-destructive/15 text-destructive" }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status]}`}>{label(status)}</span>; }
function displayName(user: CareFlowUser) { return [user.personProfile?.firstName, user.personProfile?.middleName, user.personProfile?.lastName].filter(Boolean).join(" ") || "No profile name"; }
function label(value: string) { return value.charAt(0) + value.slice(1).toLowerCase(); }
