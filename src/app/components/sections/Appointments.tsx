import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import {
  getAppointments,
  createAppointment,
  type Appointment,
  type AppointmentWorkflowAction,
  type CreateAppointmentPayload,
  executeAppointmentWorkflowTransition,
} from "../../../services/appointment.service";

import { createEncounter } from "../../../services/encounter.service";
import { getPatients, type Patient } from "../../../services/patient.service";
import { getStaff, type StaffMember } from "../../../services/staff.service";
import { useHospitalContext } from "../../context/HospitalContext";

export function Appointments() {
  const [showBookAppointment, setShowBookAppointment] =
    useState(false);


  const [selectedDoctor, setSelectedDoctor] =
    useState("All Doctors");

  const [currentDate] = useState(new Date());

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // EXECUTE WORKFLOW ACTION
  // =========================================================

  async function executeWorkflowAction(
    appointment: Appointment,
    action: AppointmentWorkflowAction,
  ) {
    try {
      setError("");

      const actionConfig =
        getAppointmentActionConfig(action);

      const encounter =
        actionConfig.createEncounter &&
        !appointment.encounter
          ? await createEncounter({
              hospitalId:
                appointment.hospitalId,
              appointmentId:
                appointment.id,
              patientHospitalId:
                appointment.patientHospitalId,
              doctorProfileId:
                appointment.doctorProfileId,
              encounterType:
                "OUTPATIENT",
            })
          : appointment.encounter;

      const updated =
        await executeAppointmentWorkflowTransition(
        appointment.id,
        action.id,
      );

      setAppointments((previous) =>
        previous.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );

      if (
        actionConfig.openConsultation &&
        encounter
      ) {
window.sessionStorage.setItem("careflow.activeSection", "consultation");
window.location.href = `/consultation?encounterId=${encounter.id}&appointmentId=${appointment.id}`;
      }
    } catch (error) {
      console.error(error);

      setError(
        "Failed to execute workflow action.",
      );
    }
  }

  // =========================================================
  // FILTER
  // =========================================================

  const filteredAppointments =
    selectedDoctor === "All Doctors"
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.doctorProfileId ===
            selectedDoctor,
        );

  // =========================================================
  // COUNTS
  // =========================================================

  const stateCounts = appointments.reduce<
    {
      id: string;
      name: string;
      type?: string;
      count: number;
    }[]
  >((counts, appointment) => {
    const state =
      appointment.workflowState;

    if (!state) {
      return counts;
    }

    const existing = counts.find(
      (item) => item.id === state.id,
    );

    if (existing) {
      existing.count += 1;
      return counts;
    }

    counts.push({
      id: state.id,
      name: state.name,
      type: state.type,
      count: 1,
    });

    return counts;
  }, []);

  const finalCount = appointments.filter(
    (appointment) =>
      appointment.workflowState?.type ===
      "FINAL",
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Appointments (OPD)
          </h1>

          <p className="text-muted-foreground">
            Manage outpatient appointments and schedules
          </p>
        </div>

        <button
          onClick={() =>
            setShowBookAppointment(true)
          }
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
          {error}
        </div>
      )}

      {/* DATE + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <h3 className="font-semibold text-foreground">
              Today's Schedule
            </h3>

            <div className="flex items-center gap-3">

              <button className="p-2 hover:bg-muted rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-4 py-2 bg-primary/10 rounded-lg">

                <p className="font-medium text-primary">
                  {currentDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>

              </div>

              <button className="p-2 hover:bg-muted rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>

          </div>

          <div className="flex gap-2 flex-wrap">

            <button
              onClick={() =>
                setSelectedDoctor("All Doctors")
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                selectedDoctor === "All Doctors"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-foreground"
              }`}
            >
              All Doctors
            </button>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">

          <QuickStat
            label="Total Appointments"
            value={String(
              appointments.length,
            )}
            color="primary"
          />

          <QuickStat
            label="Final State"
            value={String(
              finalCount,
            )}
            color="success"
          />

        </div>

      </div>

      {/* QUEUE + LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QUEUE */}
        <div className="space-y-4">

          {stateCounts.length === 0 ? (

            <QueueCard
              title="No workflow state"
              count={appointments.length}
              color="neutral"
              icon={AlertCircle}
            />

          ) : (

            stateCounts.map(
              (stateCount) => (

                <QueueCard
                  key={stateCount.id}
                  title={stateCount.name}
                  count={stateCount.count}
                  color={
                    getStateColor(
                      stateCount.type,
                    )
                  }
                  icon={
                    getStateIcon(
                      stateCount.type,
                    )
                  }
                />

              ),
            )

          )}

        </div>

        {/* LIST */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm">

          <div className="p-6 border-b border-border">

            <h3 className="font-semibold text-foreground">
              Appointment List
            </h3>

          </div>

          <div className="max-h-[600px] overflow-y-auto">

            {loading ? (

              <div className="p-10 text-center text-muted-foreground">
                Loading appointments...
              </div>

            ) : filteredAppointments.length === 0 ? (

              <div className="p-10 text-center text-muted-foreground">
                No appointments found.
              </div>

            ) : (

              <div className="divide-y divide-border">

                {filteredAppointments.map(
                  (appointment) => (

                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onAction={
                        executeWorkflowAction
                      }
                    />

                  ),
                )}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* WEEKLY CALENDAR */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">

        <h3 className="font-semibold text-foreground mb-4">
          Weekly Calendar View
        </h3>

        <WeeklyCalendar
          appointments={appointments}
        />

      </div>

      {/* BOOK APPOINTMENT */}
      {showBookAppointment && (
        <BookAppointmentModal
          onClose={() =>
            setShowBookAppointment(false)
          }
          onSaved={loadAppointments}
        />
      )}

    </div>
  );
}

function getStateColor(type?: string) {
  if (type === "FINAL") {
    return "success";
  }

  if (type === "INITIAL") {
    return "warning";
  }

  if (type === "CANCELLED") {
    return "danger";
  }

  return "info";
}

function getStateIcon(type?: string) {
  if (type === "FINAL") {
    return CheckCircle;
  }

  if (type === "INITIAL") {
    return Clock;
  }

  return AlertCircle;
}

function formatPersonName(
  person?: { firstName: string; middleName?: string | null; lastName: string } | null,
): string {
  if (!person) return "—";
  const names = [person.firstName, person.middleName, person.lastName].filter(Boolean);
  return names.join(" ");
}

function getAppointmentActionConfig(
  action: AppointmentWorkflowAction,
) {
  const uiConfig =
    action.uiConfig &&
    typeof action.uiConfig === "object"
      ? (action.uiConfig as {
          appointment?: {
            createEncounter?: boolean;
            openConsultation?: boolean;
          };
        })
      : {};

  return {
    createEncounter:
      uiConfig.appointment
        ?.createEncounter === true,
    openConsultation:
      uiConfig.appointment
        ?.openConsultation === true,
  };
}


/* =========================================================
   QUICK STAT
========================================================= */

function QuickStat({
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
      "from-primary/10 to-primary/5 border-primary/20 text-primary",

    success:
      "from-success/10 to-success/5 border-success/20 text-success",

    info:
      "from-info/10 to-info/5 border-info/20 text-info",

    warning:
      "from-warning/10 to-warning/5 border-warning/20 text-warning",

    danger:
      "from-destructive/10 to-destructive/5 border-destructive/20 text-destructive",

    neutral:
      "from-muted/70 to-muted/30 border-border text-muted-foreground",

  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}
    >

      <p className="text-2xl font-bold mb-1">
        {value}
      </p>

      <p className="text-sm">
        {label}
      </p>

    </div>
  );
}


/* =========================================================
   QUEUE CARD
========================================================= */

function QueueCard({
  title,
  count,
  color,
  icon: Icon,
}: {
  title: string;
  count: number;
  color: string;
  icon: React.ElementType;
}) {

  const colorClasses: Record<
    string,
    string
  > = {

    warning:
      "from-warning/10 to-warning/5 border-warning/20",

    info:
      "from-info/10 to-info/5 border-info/20",

    success:
      "from-success/10 to-success/5 border-success/20",

    danger:
      "from-destructive/10 to-destructive/5 border-destructive/20",

    neutral:
      "from-muted/70 to-muted/30 border-border",

  };

  const iconColors: Record<
    string,
    string
  > = {

    warning: "text-warning",
    info: "text-info",
    success: "text-success",
    danger: "text-destructive",
    neutral: "text-muted-foreground",

  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-3xl font-bold text-foreground mb-1">
            {count}
          </p>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

        </div>

        <Icon
          className={`w-8 h-8 ${iconColors[color]}`}
        />

      </div>

    </div>
  );
}


/* =========================================================
   APPOINTMENT CARD
========================================================= */

function AppointmentCard({
  appointment,
  onAction,
}: {
  appointment: Appointment;
  onAction: (
    appointment: Appointment,
    action: AppointmentWorkflowAction,
  ) => void;
}) {
  const state =
    appointment.workflowState;

  const stateType =
    state?.type;

  const stateClasses =
    stateType === "FINAL"
      ? "bg-success/10 text-success"
      : stateType === "CANCELLED"
        ? "bg-destructive/10 text-destructive"
        : stateType === "INITIAL"
          ? "bg-warning/10 text-warning"
          : "bg-info/10 text-info";

  const actions =
    appointment.availableWorkflowActions ??
    [];

  const patientName = formatPersonName(
    appointment.patientHospital?.patientProfile?.personProfile,
  );

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4 flex-1">

          {/* TIME */}
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-xl p-3 min-w-[80px]">

            <p className="text-sm font-semibold text-primary">

              {new Date(
                appointment.startTime,
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}

            </p>

          </div>

          {/* PATIENT */}
          <div className="flex-1">

            <div className="flex items-center gap-2 mb-2">

              <User className="w-4 h-4 text-muted-foreground" />

              <h4 className="font-semibold text-foreground">
                Patient
              </h4>

            </div>

            <p className="text-sm font-medium text-foreground">
              {formatPersonName(
                appointment.patientHospital?.patientProfile
                  ?.personProfile,
              )}
            </p>

            <p className="text-sm text-muted-foreground mb-1">
              MRN:{" "}
              {appointment.patientHospital
                ?.medicalRecordNumber ??
                appointment.patientHospitalId}
            </p>

            <p className="text-sm text-muted-foreground mb-1">
              {appointment.appointmentType}
            </p>

            <p className="text-sm text-muted-foreground">
              Doctor:{" "}
              {formatPersonName(
                appointment.doctorProfile?.staffProfile
                  ?.personProfile,
              ) ?? appointment.doctorProfileId}
            </p>

            {appointment.reason && (
              <p className="text-sm text-muted-foreground mt-2">
                Reason: {appointment.reason}
              </p>
            )}

          </div>

        </div>

        {/* STATUS */}
        <div className="flex flex-col items-end gap-2">

          <span
            className={`px-3 py-1 rounded-lg text-xs font-medium ${stateClasses}`}
          >
            {state?.name ??
              "No workflow state"}
          </span>

          {actions.map((action) => (

            <button
              key={action.id}
              onClick={() =>
                onAction(
                  appointment,
                  action,
                )
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {action.actionLabel}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   WEEKLY CALENDAR
========================================================= */

function WeeklyCalendar({
  appointments,
}: {
  appointments: Appointment[];
}) {

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="overflow-x-auto">

      <div className="min-w-[800px]">

        <div className="grid grid-cols-7 gap-2 mb-2">

          <div className="text-sm font-medium text-muted-foreground">
            Time
          </div>

          {days.map((day) => (

            <div
              key={day}
              className="text-sm font-medium text-center text-foreground"
            >
              {day}
            </div>

          ))}

        </div>

        {timeSlots.map((time) => (

          <div
            key={time}
            className="grid grid-cols-7 gap-2 mb-2"
          >

            <div className="text-sm text-muted-foreground py-2">
              {time}
            </div>

            {days.map((day) => {

              const matchingAppointment =
                appointments.find(
                  (appointment) => {

                    const appointmentTime =
                      new Date(
                        appointment.startTime,
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                    return (
                      appointmentTime ===
                      time
                    );
                  },
                );

              return (

                <div
                  key={`${day}-${time}`}
                  className={`rounded-lg p-2 text-xs transition-colors ${
                    matchingAppointment
                      ? "bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20"
                      : "bg-muted/30 border border-border"
                  }`}
                >

                  {matchingAppointment && (

                    <p className="font-medium text-primary truncate">
                      {formatPersonName(
                        matchingAppointment.patientHospital
                          ?.patientProfile?.personProfile,
                      ) || "Patient"}
                    </p>

                  )}

                </div>

              );

            })}

          </div>

        ))}

      </div>

    </div>
  );
}


/* =========================================================
   BOOK APPOINTMENT MODAL
========================================================= */

function BookAppointmentModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { currentHospital } = useHospitalContext();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<StaffMember[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("CONSULTATION");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentHospital) return;

    async function load() {
      try {
        const [patientData, staffData] = await Promise.all([
          getPatients("", currentHospital.id),
          getStaff(),
        ]);
        setPatients(patientData);
        setDoctors(staffData.filter((s) => s.staffType === "DOCTOR" && s.doctorProfile));
      } catch (err) {
        console.error("Failed to load patients/doctors", err);
        setError("Failed to load patients or doctors.");
      }
    }
    load();
  }, [currentHospital]);

  async function handleSubmit() {
    if (!currentHospital) return;
    if (!selectedPatientId || !selectedDoctorId || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const startTime = `${selectedDate}T${selectedTime}:00`;
      const payload: CreateAppointmentPayload = {
        hospitalId: currentHospital.id,
        patientHospitalId: selectedPatientId,
        doctorProfileId: selectedDoctorId,
        appointmentDate: selectedDate,
        startTime,
        endTime: addMinutes(startTime, 30),
        appointmentType: selectedType,
        reason: reason.trim() || undefined,
      };

      await createAppointment(payload);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to book appointment", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to book appointment. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl">

        <div className="border-b border-border px-6 py-4 flex items-center justify-between">

          <h2 className="text-xl font-bold text-foreground">
            Book New Appointment
          </h2>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>

        </div>

        <div className="p-6 space-y-6">

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* PATIENT */}
            <div>

              <label className="block text-sm font-medium text-foreground mb-2">
                Patient
              </label>

              <select
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Select patient...</option>
                {patients.map((patient) => {
                  const name = formatPersonName(patient.personProfile);
                  const registration = patient.hospitalRegistrations?.[0];
                  const mrn = registration?.medicalRecordNumber ?? "";
                  const registrationId = registration?.id ?? patient.id;
                  return (
                    <option key={patient.id} value={registrationId}>
                      {name} {mrn ? `(${mrn})` : ""}
                    </option>
                  );
                })}
              </select>

            </div>

            {/* DOCTOR */}
            <div>

              <label className="block text-sm font-medium text-foreground mb-2">
                Doctor
              </label>

              <select
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <option value="">Select doctor...</option>
                {doctors.map((doctor) => {
                  const name = formatPersonName(doctor.personProfile);
                  const spec = doctor.doctorProfile?.specialization ?? "";
                  return (
                    <option key={doctor.id} value={doctor.doctorProfile?.id ?? doctor.id}>
                      {name}{spec ? ` — ${spec}` : ""}
                    </option>
                  );
                })}
              </select>

            </div>

            {/* DATE */}
            <div>

              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>

              <input
                type="date"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

            </div>

            {/* TIME */}
            <div>

              <label className="block text-sm font-medium text-foreground mb-2">
                Time
              </label>

              <input
                type="time"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />

            </div>

            {/* TYPE */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-foreground mb-2">
                Appointment Type
              </label>

              <select
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="CONSULTATION">CONSULTATION</option>
                <option value="FOLLOW_UP">FOLLOW_UP</option>
                <option value="EMERGENCY">EMERGENCY</option>
                <option value="TELEMEDICINE">TELEMEDICINE</option>
              </select>

            </div>

            {/* NOTES */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>

              <textarea
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border resize-none"
                rows={3}
                placeholder="Any special notes or concerns..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

            </div>

          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">

            <button
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-md disabled:opacity-50"
            >
              {saving ? "Booking..." : "Book Appointment"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function addMinutes(localDateTime: string, minutes: number): string {
  const value = new Date(localDateTime);
  value.setMinutes(value.getMinutes() + minutes);

  const pad = (number: number) => String(number).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}
