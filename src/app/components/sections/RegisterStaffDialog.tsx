import { useEffect, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { createStaff, type CreateStaffPayload, type StaffType } from "../../../services/staff.service";
import { getDepartments, type Department } from "../../../services/department.service";
import { useHospitalContext } from "../../context/HospitalContext";

interface RegisterStaffDialogProps {
  onClose: () => void;
  onSaved: () => void;
}

const STAFF_TYPES: { value: StaffType; label: string }[] = [
  { value: "DOCTOR", label: "Doctor" },
  { value: "NURSE", label: "Nurse" },
  { value: "LAB_TECHNICIAN", label: "Lab Technician" },
  { value: "PHARMACIST", label: "Pharmacist" },
  { value: "RADIOLOGIST", label: "Radiologist" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "CASHIER", label: "Cashier" },
  { value: "ADMINISTRATOR", label: "Administrator" },
];

export function RegisterStaffDialog({ onClose, onSaved }: RegisterStaffDialogProps) {
  const { currentHospital } = useHospitalContext();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employeeNumber: "",
    email: "",
    initialPassword: "",
    staffType: "DOCTOR" as StaffType,
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "MALE" as "MALE" | "FEMALE",
    phoneNumber: "",
    departmentId: "",
    specialization: "",
    medicalLicenseNumber: "",
  });

  useEffect(() => {
    if (!currentHospital) {
      setDepartmentsLoading(false);
      return;
    }
    setDepartmentsLoading(true);
    getDepartments(currentHospital.id, 1, 100)
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]))
      .finally(() => setDepartmentsLoading(false));
  }, [currentHospital]);

  const isDoctor = form.staffType === "DOCTOR";

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!currentHospital) {
      setError("No hospital selected. Please select an active hospital first.");
      return;
    }
    if (!form.employeeNumber.trim()) { setError("Employee number is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (form.initialPassword.length < 12) { setError("Temporary password must be at least 12 characters."); return; }
    if (!form.firstName.trim()) { setError("First name is required."); return; }
    if (!form.lastName.trim()) { setError("Last name is required."); return; }
    if (!form.departmentId) { setError("Department is required."); return; }
    if (isDoctor) {
      if (!form.specialization.trim()) { setError("Specialization is required for doctors."); return; }
      if (!form.medicalLicenseNumber.trim()) { setError("Medical license number is required for doctors."); return; }
    }

    setSaving(true);
    try {
      const payload: CreateStaffPayload = {
        email: form.email.trim(),
        initialPassword: form.initialPassword,
        hospitalId: currentHospital.id,
        departmentId: form.departmentId,
        employeeNumber: form.employeeNumber.trim(),
        staffType: form.staffType,
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim() || undefined,
        lastName: form.lastName.trim(),
        gender: form.gender,
        phoneNumber: form.phoneNumber.trim() || undefined,
        specialization: isDoctor ? form.specialization.trim() : undefined,
        medicalLicenseNumber: isDoctor ? form.medicalLicenseNumber.trim() : undefined,
      };
      await createStaff(payload);
      onSaved();
    } catch (saveError) {
      console.error(saveError);
      setError(saveError instanceof Error ? saveError.message : "Failed to register staff member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="register-staff-title">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 id="register-staff-title" className="text-xl font-semibold text-foreground">Register Staff Member</h2>
            <p className="text-sm text-muted-foreground">{currentHospital ? `Adding to ${currentHospital.name}` : "Select a hospital first"}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50" aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <Field label="Employee Number *" value={form.employeeNumber} onChange={(v) => handleChange("employeeNumber", v)} placeholder="e.g. EMP-001" required />
          <Field label="Work Email *" value={form.email} onChange={(v) => handleChange("email", v)} placeholder="name@hospital.org" required />
          <Field label="Temporary Password *" value={form.initialPassword} onChange={(v) => handleChange("initialPassword", v)} placeholder="At least 12 characters" required type="password" />
          <SelectField label="Role *" value={form.staffType} onChange={(v) => handleChange("staffType", v)} options={STAFF_TYPES} />
          <Field label="First Name *" value={form.firstName} onChange={(v) => handleChange("firstName", v)} placeholder="First name" required />
          <Field label="Middle Name" value={form.middleName} onChange={(v) => handleChange("middleName", v)} placeholder="Middle name (optional)" />
          <Field label="Last Name *" value={form.lastName} onChange={(v) => handleChange("lastName", v)} placeholder="Last name" required />
          <SelectField label="Gender *" value={form.gender} onChange={(v) => handleChange("gender", v)} options={[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }]} />
          <Field label="Phone Number" value={form.phoneNumber} onChange={(v) => handleChange("phoneNumber", v)} placeholder="+1234567890" />
          <SelectField label="Department *" value={form.departmentId} onChange={(v) => handleChange("departmentId", v)} options={departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))} loading={departmentsLoading} placeholder="Select a department" />
          {isDoctor && (
            <>
              <div className="col-span-full border-t border-border pt-4"><p className="text-sm font-semibold text-foreground">Doctor Information</p></div>
              <Field label="Specialization *" value={form.specialization} onChange={(v) => handleChange("specialization", v)} placeholder="e.g. Cardiology" required />
              <Field label="Medical License Number *" value={form.medicalLicenseNumber} onChange={(v) => handleChange("medicalLicenseNumber", v)} placeholder="e.g. MLN-12345" required />
            </>
          )}
        </div>
        <div className="border-t border-border px-6 py-4">
          {error && <p role="alert" className="mb-3 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="size-4" />{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">Cancel</button>
            <button disabled={saving || !currentHospital} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {saving && <Loader2 className="size-4 animate-spin" />}{saving ? "Registering..." : "Register Staff"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = false, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string }) {
  return <label className="block text-sm font-medium text-foreground">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" required={required} /></label>;
}

function SelectField({ label, value, onChange, options, loading, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; loading?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-medium text-foreground">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
    <option value="">{loading ? "Loading..." : placeholder || (options.length === 0 ? "No options available" : "Select...")}</option>
    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select></label>;
}
