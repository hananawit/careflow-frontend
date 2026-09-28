import { useEffect, useState } from "react";

import {
  getPatients,
  getPatient,
  createPatient,
  type Patient,
  type PatientPayload,
  type Gender,
  type BloodType,
} from "../../../services/patient.service";

import {
  createAddress,
} from "../../../services/address.service";

import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  FileText,
  User,
  Upload,
  X,
} from "lucide-react";

/* =========================================================
   AGE CALCULATION
========================================================= */

function calculateAge(
  dateOfBirth?: string,
): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age >= 0 ? age : null;
}

/* =========================================================
   PATIENT MANAGEMENT
========================================================= */

export function PatientManagement() {
  /* =======================================================
     PATIENT LIST
  ======================================================= */

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  /* =======================================================
     ADD PATIENT
  ======================================================= */

  const [showAddPatient, setShowAddPatient] =
    useState(false);

  const [savingPatient, setSavingPatient] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  /* =======================================================
     DETAILS
  ======================================================= */

  const [selectedPatient, setSelectedPatient] =
    useState<string | null>(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [patientForm, setPatientForm] =
    useState<PatientPayload & {
      age?: number;

      address: {
        country: string;
        region: string;
        city: string;
        subCity: string;
        woreda: string;
        houseNumber: string;
      };
    }>({
      firstName: "",

      middleName: "",

      lastName: "",

      gender: "MALE",

      dateOfBirth: "",

      age: undefined,

      phoneNumber: "",

      nationalId: "",

      bloodType: "UNKNOWN",

      allergies: "",

      address: {
        country: "Ethiopia",

        region: "Addis Ababa",

        city: "Addis Ababa",

        subCity: "",

        woreda: "",

        houseNumber: "",
      },
    });

  /* =========================================================
     LOAD PATIENTS
  ========================================================= */

  useEffect(() => {
    loadPatients();
  }, [search]);

  async function loadPatients() {
    try {
      setLoading(true);

      setError("");

      const data =
        await getPatients(search);

      setPatients(data);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load patients.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     RESET FORM
  ========================================================= */

  function resetPatientForm() {
    setPatientForm({
      firstName: "",

      middleName: "",

      lastName: "",

      gender: "MALE",

      dateOfBirth: "",

      age: undefined,

      phoneNumber: "",

      nationalId: "",

      bloodType: "UNKNOWN",

      allergies: "",

      address: {
        country: "Ethiopia",

        region: "Addis Ababa",

        city: "Addis Ababa",

        subCity: "",

        woreda: "",

        houseNumber: "",
      },
    });

    setSaveError("");
  }

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  function closeAddPatientModal() {
    if (savingPatient) {
      return;
    }

    setShowAddPatient(false);

    resetPatientForm();
  }

  /* =========================================================
     SAVE PATIENT
  ========================================================= */

  async function handleSavePatient() {
    setSaveError("");

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!patientForm.firstName.trim()) {
      setSaveError(
        "First name is required.",
      );

      return;
    }

    if (!patientForm.lastName.trim()) {
      setSaveError(
        "Last name is required.",
      );

      return;
    }

    if (!patientForm.phoneNumber.trim()) {
      setSaveError(
        "Phone number is required.",
      );

      return;
    }

    if (
      !patientForm.dateOfBirth &&
      patientForm.age === undefined
    ) {
      setSaveError(
        "Enter either Date of Birth or Age.",
      );

      return;
    }

    if (
      patientForm.age !== undefined &&
      (
        patientForm.age < 0 ||
        patientForm.age > 150
      )
    ) {
      setSaveError(
        "Age must be between 0 and 150.",
      );

      return;
    }

    if (!patientForm.address.subCity) {
      setSaveError(
        "Please select a sub-city.",
      );

      return;
    }

    if (!patientForm.address.woreda.trim()) {
      setSaveError(
        "Woreda is required.",
      );

      return;
    }

    /* -------------------------------------------------------
       CALCULATE DOB FROM AGE
    ------------------------------------------------------- */

    let dateOfBirth =
      patientForm.dateOfBirth ||
      undefined;

    if (
      !dateOfBirth &&
      patientForm.age !== undefined
    ) {
      const today = new Date();

      const estimatedDob =
        new Date(
          today.getFullYear() -
            patientForm.age,

          today.getMonth(),

          today.getDate(),
        );

      dateOfBirth =
        estimatedDob
          .toISOString()
          .split("T")[0];
    }

    /* -------------------------------------------------------
       VALIDATE DOB
    ------------------------------------------------------- */

    if (dateOfBirth) {
      const selectedDate =
        new Date(dateOfBirth);

      const today = new Date();

      if (selectedDate > today) {
        setSaveError(
          "Date of birth cannot be in the future.",
        );

        return;
      }
    }

    try {
      setSavingPatient(true);

      /* =====================================================
         STEP 1: CREATE PATIENT
      ===================================================== */

      const patientPayload: PatientPayload = {
        firstName:
          patientForm.firstName.trim(),

        middleName:
          patientForm.middleName?.trim() ||
          undefined,

        lastName:
          patientForm.lastName.trim(),

        gender:
          patientForm.gender,

        dateOfBirth:
          dateOfBirth,

        phoneNumber:
          patientForm.phoneNumber.trim(),

        nationalId:
          patientForm.nationalId?.trim() ||
          undefined,

        bloodType:
          patientForm.bloodType ||
          "UNKNOWN",

        allergies:
          patientForm.allergies?.trim() ||
          undefined,
      };

      const createdPatient =
        await createPatient(
          patientPayload,
        );

      /* =====================================================
         STEP 2: CREATE ADDRESS
      ===================================================== */

      if (
        !createdPatient.personProfileId
      ) {
        throw new Error(
          "Patient was created but personProfileId was not returned.",
        );
      }

      await createAddress({
        personProfileId:
          createdPatient.personProfileId,

        country:
          patientForm.address.country,

        region:
          patientForm.address.region,

        city:
          patientForm.address.city,

        subCity:
          patientForm.address.subCity,

        woreda:
          patientForm.address.woreda,

        houseNumber:
          patientForm.address.houseNumber
            .trim() || undefined,
      });

      /* =====================================================
         STEP 3: RELOAD PATIENTS
      ===================================================== */

      await loadPatients();

      /* =====================================================
         STEP 4: CLOSE FORM
      ===================================================== */

      setShowAddPatient(false);

      resetPatientForm();

    } catch (err) {
      console.error(err);

      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to save patient.",
      );
    } finally {
      setSavingPatient(false);
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Patient Management
          </h1>

          <p className="text-muted-foreground">
            Manage patient records and medical history
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetPatientForm();

            setShowAddPatient(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />

          Add New Patient
        </button>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />

          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Filter className="w-5 h-5" />

            Filter
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-5 h-5" />

            Export
          </button>

        </div>

      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <StatCard
          label="Total Patients"
          value={String(patients.length)}
          color="primary"
        />

        <StatCard
          label="Active Patients"
          value={String(patients.length)}
          color="success"
        />

        <StatCard
          label="New This Month"
          value="0"
          color="info"
        />

        <StatCard
          label="Pending Follow-ups"
          value="0"
          color="warning"
        />

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-muted/50 border-b border-border">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Patient ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Date of Birth
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Age
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Gender
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Medical Record No.
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-border">

              {loading ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading patients...
                  </td>
                </tr>

              ) : error ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>

              ) : patients.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No patients found.
                  </td>
                </tr>

              ) : (

                patients.map((patient) => {

                  const dob =
                    patient.personProfile
                      .dateOfBirth;

                  const age =
                    calculateAge(
                      dob || undefined,
                    );

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-muted/30 transition-colors"
                    >

                      <td className="px-6 py-4">

                        <span className="font-mono text-sm text-primary font-semibold">
                          {patient.id}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-foreground">

                          {
                            patient
                              .personProfile
                              .firstName
                          }{" "}

                          {
                            patient
                              .personProfile
                              .middleName
                              ? `${patient.personProfile.middleName} `
                              : ""
                          }

                          {
                            patient
                              .personProfile
                              .lastName
                          }

                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-foreground">

                          {dob
                            ? new Date(
                                dob,
                              ).toLocaleDateString()
                            : "—"}

                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-foreground">

                          {age !== null
                            ? `${age} years`
                            : "—"}

                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-foreground">
                          {
                            patient
                              .personProfile
                              .gender
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-foreground">
                          {
                            patient
                              .personProfile
                              .phoneNumber ||
                            "—"
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="text-sm text-foreground font-mono">

                          {
                            patient
                              .hospitalRegistrations
                              ?. [0]
                              ?.medicalRecordNumber ||
                            "—"
                          }

                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPatient(
                                patient.id,
                              )
                            }
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors"
                            title="Medical Records"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          ADD PATIENT MODAL
      ===================================================== */}

      {showAddPatient && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">

              <h2 className="text-xl font-bold text-foreground">
                Add New Patient
              </h2>

              <button
                type="button"
                onClick={closeAddPatientModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="p-6 space-y-8">

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================= */}

              <section>

                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">

                  <User className="w-5 h-5 text-primary" />

                  Personal Information

                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <InputField
                    label="First Name *"
                    placeholder="Enter first name"
                    value={
                      patientForm.firstName
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        firstName:
                          e.target.value,
                      })
                    }
                  />

                  <InputField
                    label="Middle Name"
                    placeholder="Enter middle name"
                    value={
                      patientForm.middleName ||
                      ""
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        middleName:
                          e.target.value,
                      })
                    }
                  />

                  <InputField
                    label="Last Name *"
                    placeholder="Enter last name"
                    value={
                      patientForm.lastName
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        lastName:
                          e.target.value,
                      })
                    }
                  />

                  {/* DOB */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={
                        patientForm.dateOfBirth ||
                        ""
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          dateOfBirth:
                            e.target.value,

                          age:
                            e.target.value
                              ? undefined
                              : patientForm.age,
                        })
                      }
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />

                  </div>

                  {/* AGE */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Age
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={
                        patientForm.dateOfBirth
                          ? calculateAge(
                              patientForm.dateOfBirth,
                            ) ?? ""
                          : patientForm.age ??
                            ""
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          age:
                            e.target.value
                              ? Number(
                                  e.target.value,
                                )
                              : undefined,
                        })
                      }
                      readOnly={
                        !!patientForm.dateOfBirth
                      }
                      placeholder="Enter age if DOB is unknown"
                      className={`w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        patientForm.dateOfBirth
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-input-background"
                      }`}
                    />

                  </div>

                  {/* GENDER */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Gender *
                    </label>

                    <select
                      value={
                        patientForm.gender
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          gender:
                            e.target
                              .value as Gender,
                        })
                      }
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >

                      <option value="MALE">
                        Male
                      </option>

                      <option value="FEMALE">
                        Female
                      </option>

                    </select>

                  </div>

                  {/* BLOOD TYPE */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Blood Group
                    </label>

                    <select
                      value={
                        patientForm.bloodType ||
                        "UNKNOWN"
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,
                          bloodType:
                            e.target
                              .value as BloodType,
                        })
                      }
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >

                      <option value="UNKNOWN">
                        Unknown
                      </option>

                      <option value="A_POSITIVE">
                        A+
                      </option>

                      <option value="A_NEGATIVE">
                        A-
                      </option>

                      <option value="B_POSITIVE">
                        B+
                      </option>

                      <option value="B_NEGATIVE">
                        B-
                      </option>

                      <option value="AB_POSITIVE">
                        AB+
                      </option>

                      <option value="AB_NEGATIVE">
                        AB-
                      </option>

                      <option value="O_POSITIVE">
                        O+
                      </option>

                      <option value="O_NEGATIVE">
                        O-
                      </option>

                    </select>

                  </div>

                  <InputField
                    label="Phone Number *"
                    type="tel"
                    placeholder="09XXXXXXXX"
                    value={
                      patientForm.phoneNumber
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        phoneNumber:
                          e.target.value,
                      })
                    }
                  />

                  <InputField
                    label="National ID"
                    placeholder="Enter national ID"
                    value={
                      patientForm.nationalId ||
                      ""
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        nationalId:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </section>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <section>

                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">

                  <User className="w-5 h-5 text-primary" />

                  Address

                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <InputField
                    label="Country"
                    value="Ethiopia"
                    readOnly
                  />

                  {/* REGION */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Region
                    </label>

                    <select
                      value={
                        patientForm.address
                          .region
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,

                          address: {
                            ...patientForm.address,

                            region:
                              e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >

                      <option value="Addis Ababa">
                        Addis Ababa
                      </option>

                    </select>

                  </div>

                  {/* CITY */}

                  <InputField
                    label="City"
                    value={
                      patientForm.address.city
                    }
                    readOnly
                  />

                  {/* SUB CITY */}

                  <div>

                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sub-city *
                    </label>

                    <select
                      value={
                        patientForm.address
                          .subCity
                      }
                      onChange={(e) =>
                        setPatientForm({
                          ...patientForm,

                          address: {
                            ...patientForm.address,

                            subCity:
                              e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >

                      <option value="">
                        Select sub-city
                      </option>

                      <option value="Addis Ketema">
                        Addis Ketema
                      </option>

                      <option value="Akaki Kaliti">
                        Akaki Kaliti
                      </option>

                      <option value="Arada">
                        Arada
                      </option>

                      <option value="Bole">
                        Bole
                      </option>

                      <option value="Gullele">
                        Gullele
                      </option>

                      <option value="Kirkos">
                        Kirkos
                      </option>

                      <option value="Kolfe Keranio">
                        Kolfe Keranio
                      </option>

                      <option value="Lideta">
                        Lideta
                      </option>

                      <option value="Nifas Silk-Lafto">
                        Nifas Silk-Lafto
                      </option>

                      <option value="Yeka">
                        Yeka
                      </option>

                      <option value="Lemi Kura">
                        Lemi Kura
                      </option>

                    </select>

                  </div>

                  {/* WOREDA */}

                  <InputField
                    label="Woreda *"
                    placeholder="Enter woreda"
                    value={
                      patientForm.address
                        .woreda
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,

                        address: {
                          ...patientForm.address,

                          woreda:
                            e.target.value,
                        },
                      })
                    }
                  />

                  {/* HOUSE NUMBER */}

                  <InputField
                    label="House Number"
                    placeholder="Enter house number"
                    value={
                      patientForm.address
                        .houseNumber
                    }
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,

                        address: {
                          ...patientForm.address,

                          houseNumber:
                            e.target.value,
                        },
                      })
                    }
                  />

                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Address will be saved separately through the
                  address API after the patient is created.
                </p>

              </section>

              {/* =================================================
                  MEDICAL INFORMATION
              ================================================= */}

              <section>

                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">

                  <FileText className="w-5 h-5 text-warning" />

                  Medical Information

                </h3>

                <label className="block text-sm font-medium text-foreground mb-2">
                  Allergies
                </label>

                <textarea
                  value={
                    patientForm.allergies ||
                    ""
                  }
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      allergies:
                        e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="List any known allergies..."
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />

              </section>

              {/* =================================================
                  DOCUMENTS
              ================================================= */}

              <section>

                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">

                  <Upload className="w-5 h-5 text-info" />

                  Upload Documents

                </h3>

                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">

                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />

                  <p className="text-foreground font-medium mb-1">
                    Click to upload or drag and drop
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Previous medical records,
                    X-rays, etc. (Max 10MB)
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    Document upload will be
                    connected later.
                  </p>

                </div>

              </section>

              {/* =================================================
                  ERROR
              ================================================= */}

              {saveError && (

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {saveError}
                </div>

              )}

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">

                <button
                  type="button"
                  onClick={
                    closeAddPatientModal
                  }
                  disabled={
                    savingPatient
                  }
                  className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSavePatient
                  }
                  disabled={
                    savingPatient
                  }
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPatient
                    ? "Saving..."
                    : "Save Patient"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          PATIENT DETAILS
      ===================================================== */}

      {selectedPatient && (

        <PatientDetailsModal
          patientId={
            selectedPatient
          }
          onClose={() =>
            setSelectedPatient(null)
          }
        />

      )}

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<
    string,
    string
  > = {
    primary:
      "from-primary/10 to-primary/5 border-primary/20",

    success:
      "from-success/10 to-success/5 border-success/20",

    info:
      "from-info/10 to-info/5 border-info/20",

    warning:
      "from-warning/10 to-warning/5 border-warning/20",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}
    >

      <p className="text-sm text-muted-foreground mb-1">
        {label}
      </p>

      <p className="text-3xl font-bold text-foreground">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  readOnly = false,
}: {
  label: string;

  type?: string;

  placeholder?: string;

  value?: string;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  readOnly?: boolean;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          readOnly
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-input-background"
        }`}
      />

    </div>
  );
}

/* =========================================================
   PATIENT DETAILS MODAL
========================================================= */

function PatientDetailsModal({
  patientId,
  onClose,
}: {
  patientId: string;

  onClose: () => void;
}) {
  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPatient() {
      try {
        setLoading(true);

        setError("");

        const data =
          await getPatient(
            patientId,
          );

        setPatient(data);

      } catch (err) {
        console.error(err);

        setError(
          "Failed to load patient details.",
        );

      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [patientId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">

          <h2 className="text-xl font-bold text-foreground">
            Patient Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        <div className="p-6">

          {loading ? (

            <p className="text-muted-foreground">
              Loading patient...
            </p>

          ) : error ? (

            <p className="text-red-500">
              {error}
            </p>

          ) : patient ? (

            <div className="space-y-6">

              <div>

                <h3 className="text-2xl font-bold text-foreground">

                  {
                    patient
                      .personProfile
                      .firstName
                  }{" "}

                  {
                    patient
                      .personProfile
                      .middleName
                      ? `${patient.personProfile.middleName} `
                      : ""
                  }

                  {
                    patient
                      .personProfile
                      .lastName
                  }

                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Patient ID: {patient.id}
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <DetailRow
                  label="Gender"
                  value={
                    patient
                      .personProfile
                      .gender
                  }
                />

                <DetailRow
                  label="Date of Birth"
                  value={
                    patient
                      .personProfile
                      .dateOfBirth
                      ? new Date(
                          patient
                            .personProfile
                            .dateOfBirth,
                        ).toLocaleDateString()
                      : "Not provided"
                  }
                />

                <DetailRow
                  label="Age"
                  value={
                    calculateAge(
                      patient
                        .personProfile
                        .dateOfBirth ||
                        undefined,
                    ) !== null
                      ? `${calculateAge(
                          patient
                            .personProfile
                            .dateOfBirth ||
                            undefined,
                        )} years`
                      : "Not available"
                  }
                />

                <DetailRow
                  label="Phone"
                  value={
                    patient
                      .personProfile
                      .phoneNumber ||
                    "Not provided"
                  }
                />

                <DetailRow
                  label="National ID"
                  value={
                    patient
                      .personProfile
                      .nationalId ||
                    "Not provided"
                  }
                />

                <DetailRow
                  label="Blood Type"
                  value={
                    patient.bloodType ||
                    "Unknown"
                  }
                />

                <DetailRow
                  label="Medical Record No."
                  value={
                    patient
                      .hospitalRegistrations
                      ?. [0]
                      ?.medicalRecordNumber ||
                    "Not available"
                  }
                />

                <DetailRow
                  label="Allergies"
                  value={
                    patient.allergies ||
                    "None recorded"
                  }
                />

              </div>

              {/* ADDRESS */}

              {patient.personProfile.address && (

                <div>

                  <h3 className="font-semibold text-foreground mb-4">
                    Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <DetailRow
                      label="Country"
                      value={
                        patient
                          .personProfile
                          .address
                          .country ||
                        "Not provided"
                      }
                    />

                    <DetailRow
                      label="Region"
                      value={
                        patient
                          .personProfile
                          .address
                          .region ||
                        "Not provided"
                      }
                    />

                    <DetailRow
                      label="City"
                      value={
                        patient
                          .personProfile
                          .address
                          .city ||
                        "Not provided"
                      }
                    />

                    <DetailRow
                      label="Sub-city"
                      value={
                        patient
                          .personProfile
                          .address
                          .subCity ||
                        "Not provided"
                      }
                    />

                    <DetailRow
                      label="Woreda"
                      value={
                        patient
                          .personProfile
                          .address
                          .woreda ||
                        "Not provided"
                      }
                    />

                    <DetailRow
                      label="House Number"
                      value={
                        patient
                          .personProfile
                          .address
                          .houseNumber ||
                        "Not provided"
                      }
                    />

                  </div>

                </div>

              )}

            </div>

          ) : (

            <p className="text-muted-foreground">
              Patient not found.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-xl">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-foreground">
        {value}
      </span>

    </div>
  );
}