import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Stethoscope } from "lucide-react";
import { createEncounter } from "../../../services/encounter.service";
import { getAppointments, type Appointment } from "../../../services/appointment.service";
import { useHospitalContext } from "../../context/HospitalContext";

export function Encounter() {
  const { currentHospital } = useHospitalContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadAppointments();
  }, [currentHospital?.id]);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");
      const data = await getAppointments();
      setAppointments(
        currentHospital
          ? data.filter((appointment) => appointment.hospitalId === currentHospital.id)
          : [],
      );
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "Unable to load the encounter queue.");
    } finally {
      setLoading(false);
    }
  }

  async function startEncounter(appointment: Appointment) {
    try {
      setStartingId(appointment.id);
      setError("");
      setSuccess("");
      await createEncounter({
        hospitalId: appointment.hospitalId,
        appointmentId: appointment.id,
        patientHospitalId: appointment.patientHospitalId,
        doctorProfileId: appointment.doctorProfileId,
        encounterType: "OUTPATIENT",
      });
      setSuccess("Encounter started successfully.");
      setAppointments((previous) => previous.filter((item) => item.id !== appointment.id));
    } catch (startError) {
      console.error(startError);
      setError(startError instanceof Error ? startError.message : "Unable to start the encounter.");
    } finally {
      setStartingId(null);
    }
  }

  const startableAppointments = useMemo(
    () => appointments.filter((appointment) => (
      !appointment.encounter
      && ["SCHEDULED", "CHECKED_IN"].includes(appointment.status)
    )),
    [appointments],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Queue</h1>
        <p className="mt-1 text-muted-foreground">
          Start an encounter for checked-in or scheduled outpatient appointments
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          {success}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading encounter queue...
          </div>
        ) : startableAppointments.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground">
            <Stethoscope className="size-5" />
            <p className="text-sm">No appointments are ready to start.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {startableAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-foreground">{formatPatientName(appointment)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {appointment.appointmentType.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(appointment.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {appointment.status.replaceAll("_", " ")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void startEncounter(appointment)}
                  disabled={startingId === appointment.id}
                  className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {startingId === appointment.id ? <><Loader2 className="size-4 animate-spin" />Starting...</> : "Start encounter"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function formatPatientName(appointment: Appointment) {
  const person = appointment.patientHospital?.patientProfile?.personProfile;
  return person
    ? [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ")
    : "Patient record";
}
