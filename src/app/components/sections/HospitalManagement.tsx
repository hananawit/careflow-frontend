import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Edit,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createHospital,
  deleteHospital,
  getHospitals,
  updateHospital,
  type CreateHospitalPayload,
  type Hospital,
  type HospitalStatus,
  type HospitalType,
} from "../../../services/hospital.service";

import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
  type CreateDepartmentPayload,
  type Department,
  type DepartmentStatus,
} from "../../../services/department.service";

interface HospitalManagementProps {
  onBack: () => void;
}

const hospitalTypes: HospitalType[] = [
  "PUBLIC",
  "PRIVATE",
  "CLINIC",
  "SPECIALTY",
];

const emptyHospitalForm: CreateHospitalPayload = {
  name: "",
  code: "",
  type: "PUBLIC",
  licenseNumber: "",
  email: "",
  phoneNumber: "",
  website: "",
  status: "ACTIVE",
};

const emptyDepartmentForm: CreateDepartmentPayload = {
  hospitalId: "",
  name: "",
  code: "",
  description: "",
  status: "ACTIVE",
};

export function HospitalManagement({
  onBack,
}: HospitalManagementProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [editingHospital, setEditingHospital] =
    useState<Hospital | null>(null);
  const [hospitalForm, setHospitalForm] =
    useState<CreateHospitalPayload>(emptyHospitalForm);

  const [selectedHospital, setSelectedHospital] =
    useState<Hospital | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] =
    useState(false);

  const [showDepartmentForm, setShowDepartmentForm] =
    useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);
  const [departmentForm, setDepartmentForm] =
    useState<CreateDepartmentPayload>(emptyDepartmentForm);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const response = await getHospitals(1, 100);
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to load hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async (hospitalId: string) => {
    try {
      setDepartmentsLoading(true);

      const response = await getDepartments(
        hospitalId,
        1,
        100,
      );

      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) => {
    const value = search.toLowerCase();

    return (
      hospital.name.toLowerCase().includes(value) ||
      hospital.code.toLowerCase().includes(value) ||
      hospital.type.toLowerCase().includes(value)
    );
  });

  const openCreateHospital = () => {
    setEditingHospital(null);
    setHospitalForm(emptyHospitalForm);
    setShowHospitalForm(true);
  };

  const openEditHospital = (hospital: Hospital) => {
    setEditingHospital(hospital);

    setHospitalForm({
      name: hospital.name,
      code: hospital.code,
      type: hospital.type,
      licenseNumber: hospital.licenseNumber ?? "",
      email: hospital.email ?? "",
      phoneNumber: hospital.phoneNumber ?? "",
      website: hospital.website ?? "",
      status: hospital.status,
    });

    setShowHospitalForm(true);
  };

  const handleHospitalSubmit = async () => {
    const payload: CreateHospitalPayload = {
      name: hospitalForm.name.trim(),
      code: hospitalForm.code.trim(),
      type: hospitalForm.type,
      ...(hospitalForm.licenseNumber?.trim()
        ? { licenseNumber: hospitalForm.licenseNumber.trim() }
        : {}),
      ...(hospitalForm.email?.trim()
        ? { email: hospitalForm.email.trim() }
        : {}),
      ...(hospitalForm.phoneNumber?.trim()
        ? { phoneNumber: hospitalForm.phoneNumber.trim() }
        : {}),
      ...(hospitalForm.website?.trim()
        ? { website: hospitalForm.website.trim() }
        : {}),
      ...(hospitalForm.status
        ? { status: hospitalForm.status }
        : {}),
    };

    try {
      setSaving(true);

      if (editingHospital) {
        await updateHospital(editingHospital.id, payload);
      } else {
        await createHospital(payload);
      }

      setShowHospitalForm(false);
      setEditingHospital(null);
      setHospitalForm(emptyHospitalForm);

      await loadHospitals();
    } catch (error) {
      console.error("Failed to save hospital:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleHospitalStatus = async (
    hospital: Hospital,
  ) => {
    try {
      await updateHospital(hospital.id, {
        status:
          hospital.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      });

      await loadHospitals();

      if (selectedHospital?.id === hospital.id) {
        setSelectedHospital({
          ...selectedHospital,
          status:
            hospital.status === "ACTIVE"
              ? "INACTIVE"
              : "ACTIVE",
        });
      }
    } catch (error) {
      console.error(
        "Failed to update hospital status:",
        error,
      );
    }
  };

  const removeHospital = async (hospital: Hospital) => {
    if (
      !window.confirm(
        `Delete "${hospital.name}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteHospital(hospital.id);

      if (selectedHospital?.id === hospital.id) {
        setSelectedHospital(null);
        setDepartments([]);
      }

      await loadHospitals();
    } catch (error) {
      console.error("Failed to delete hospital:", error);
    }
  };

  const openDepartments = async (hospital: Hospital) => {
    setSelectedHospital(hospital);
    await loadDepartments(hospital.id);
  };

  const openCreateDepartment = () => {
    if (!selectedHospital) return;

    setEditingDepartment(null);

    setDepartmentForm({
      ...emptyDepartmentForm,
      hospitalId: selectedHospital.id,
    });

    setShowDepartmentForm(true);
  };

  const openEditDepartment = (
    department: Department,
  ) => {
    setEditingDepartment(department);

    setDepartmentForm({
      hospitalId: department.hospitalId,
      name: department.name,
      code: department.code,
      description: department.description ?? "",
      status: department.status,
    });

    setShowDepartmentForm(true);
  };

  const handleDepartmentSubmit = async () => {
    if (!selectedHospital) return;

    const payload: CreateDepartmentPayload = {
      hospitalId: selectedHospital.id,
      name: departmentForm.name.trim(),
      code: departmentForm.code.trim(),
      ...(departmentForm.description?.trim()
        ? {
            description:
              departmentForm.description.trim(),
          }
        : {}),
      ...(departmentForm.status
        ? { status: departmentForm.status }
        : {}),
    };

    try {
      setSaving(true);

      if (editingDepartment) {
        await updateDepartment(
          editingDepartment.id,
          payload,
        );
      } else {
        await createDepartment(payload);
      }

      setShowDepartmentForm(false);
      setEditingDepartment(null);
      setDepartmentForm(emptyDepartmentForm);

      await loadDepartments(selectedHospital.id);
    } catch (error) {
      console.error(
        "Failed to save department:",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleDepartmentStatus = async (
    department: Department,
  ) => {
    if (!selectedHospital) return;

    try {
      await updateDepartment(department.id, {
        status:
          department.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      });

      await loadDepartments(selectedHospital.id);
    } catch (error) {
      console.error(
        "Failed to update department status:",
        error,
      );
    }
  };

  const removeDepartment = async (
    department: Department,
  ) => {
    if (
      !window.confirm(
        `Delete "${department.name}"?`,
      )
    ) {
      return;
    }

    if (!selectedHospital) return;

    try {
      await deleteDepartment(department.id);
      await loadDepartments(selectedHospital.id);
    } catch (error) {
      console.error(
        "Failed to delete department:",
        error,
      );
    }
  };

  if (selectedHospital) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedHospital(null);
                setDepartments([]);
              }}
              className="p-2 rounded-lg border border-border hover:bg-muted"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Departments
              </h1>

              <p className="text-muted-foreground">
                {selectedHospital.name} ·{" "}
                {selectedHospital.code}
              </p>
            </div>
          </div>

          <button
            onClick={openCreateDepartment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus size={18} />
            Add Department
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {departmentsLoading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="p-10 text-center">
              <Building2
                size={40}
                className="mx-auto mb-3 text-muted-foreground"
              />

              <h3 className="font-semibold text-foreground">
                No departments yet
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Add the first department for this hospital.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Department
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Code
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Description
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4 font-medium">
                      {department.name}
                    </td>

                    <td className="px-6 py-4">
                      {department.code}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {department.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          department.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {department.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditDepartment(
                              department,
                            )
                          }
                          className="p-2 rounded-lg hover:bg-muted"
                          title="Edit"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() =>
                            toggleDepartmentStatus(
                              department,
                            )
                          }
                          className="p-2 rounded-lg hover:bg-muted"
                          title={
                            department.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          <Power size={17} />
                        </button>

                        <button
                          onClick={() =>
                            removeDepartment(
                              department,
                            )
                          }
                          className="p-2 rounded-lg hover:bg-muted text-destructive"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showDepartmentForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold">
                    {editingDepartment
                      ? "Edit Department"
                      : "Add Department"}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {selectedHospital.name}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowDepartmentForm(false)
                  }
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <FormField
                  label="Department Name"
                  value={departmentForm.name}
                  onChange={(value) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  }
                  placeholder="e.g. Outpatient Department"
                />

                <FormField
                  label="Department Code"
                  value={departmentForm.code}
                  onChange={(value) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      code: value,
                    }))
                  }
                  placeholder="e.g. OPD"
                />

                <FormField
                  label="Description"
                  value={
                    departmentForm.description ?? ""
                  }
                  onChange={(value) =>
                    setDepartmentForm((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Department description"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>

                  <select
                    value={
                      departmentForm.status ?? "ACTIVE"
                    }
                    onChange={(e) =>
                      setDepartmentForm((prev) => ({
                        ...prev,
                        status: e.target
                          .value as DepartmentStatus,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                  >
                    <option value="ACTIVE">
                      Active
                    </option>
                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() =>
                    setShowDepartmentForm(false)
                  }
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDepartmentSubmit}
                  disabled={
                    saving ||
                    !departmentForm.name.trim() ||
                    !departmentForm.code.trim()
                  }
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingDepartment
                      ? "Save Changes"
                      : "Create Department"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-border hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hospital Management
            </h1>

            <p className="text-muted-foreground">
              Manage hospitals and their departments
            </p>
          </div>
        </div>

        <button
          onClick={openCreateHospital}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus size={18} />
          Add Hospital
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">
            Loading hospitals...
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No hospitals found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Hospital
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Code
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr
                  key={hospital.id}
                  className="border-t border-border"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {hospital.name}
                    </div>

                    {hospital.email && (
                      <div className="text-sm text-muted-foreground">
                        {hospital.email}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {hospital.code}
                  </td>

                  <td className="px-6 py-4">
                    {hospital.type}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        hospital.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {hospital.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openDepartments(hospital)
                        }
                        className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium"
                      >
                        Departments
                      </button>

                      <button
                        onClick={() =>
                          openEditHospital(hospital)
                        }
                        className="p-2 rounded-lg hover:bg-muted"
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        onClick={() =>
                          toggleHospitalStatus(hospital)
                        }
                        className="p-2 rounded-lg hover:bg-muted"
                        title={
                          hospital.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <Power size={17} />
                      </button>

                      <button
                        onClick={() =>
                          removeHospital(hospital)
                        }
                        className="p-2 rounded-lg hover:bg-muted text-destructive"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showHospitalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editingHospital
                  ? "Edit Hospital"
                  : "Add Hospital"}
              </h2>

              <button
                onClick={() =>
                  setShowHospitalForm(false)
                }
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Hospital Name"
                value={hospitalForm.name}
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
                placeholder="Hospital name"
              />

              <FormField
                label="Code"
                value={hospitalForm.code}
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    code: value,
                  }))
                }
                placeholder="Hospital code"
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Type
                </label>

                <select
                  value={hospitalForm.type}
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      type: e.target
                        .value as HospitalType,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                >
                  {hospitalTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="License Number"
                value={
                  hospitalForm.licenseNumber ?? ""
                }
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    licenseNumber: value,
                  }))
                }
                placeholder="License number"
              />

              <FormField
                label="Email"
                value={hospitalForm.email ?? ""}
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
                placeholder="Email"
              />

              <FormField
                label="Phone"
                value={
                  hospitalForm.phoneNumber ?? ""
                }
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    phoneNumber: value,
                  }))
                }
                placeholder="Phone number"
              />

              <FormField
                label="Website"
                value={hospitalForm.website ?? ""}
                onChange={(value) =>
                  setHospitalForm((prev) => ({
                    ...prev,
                    website: value,
                  }))
                }
                placeholder="Website"
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>

                <select
                  value={
                    hospitalForm.status ?? "ACTIVE"
                  }
                  onChange={(e) =>
                    setHospitalForm((prev) => ({
                      ...prev,
                      status: e.target
                        .value as HospitalStatus,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                >
                  <option value="ACTIVE">
                    Active
                  </option>
                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() =>
                  setShowHospitalForm(false)
                }
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={handleHospitalSubmit}
                disabled={
                  saving ||
                  !hospitalForm.name.trim() ||
                  !hospitalForm.code.trim()
                }
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingHospital
                    ? "Save Changes"
                    : "Create Hospital"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
      />
    </div>
  );
}