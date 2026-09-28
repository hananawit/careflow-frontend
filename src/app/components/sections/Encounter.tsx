import { useEffect, useState } from "react";
import {
  createEncounter,
  type EncounterType,
} from "../../../services/encounter.service";
import {
  getAppointments,
  type Appointment,
} from "../../../services/appointment.service";

export function Encounter() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);

      const data = await getAppointments();

      setAppointments(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }

  async function startEncounter(
    appointment: Appointment,
  ) {
    try {
      setStartingId(appointment.id);
      setMessage("");

      await createEncounter({
        hospitalId: appointment.hospitalId,
        appointmentId: appointment.id,
        patientHospitalId:
          appointment.patientHospitalId,
        doctorProfileId:
          appointment.doctorProfileId,
        encounterType:
          "OUTPATIENT" as EncounterType,
      });

      setMessage(
        "Encounter started successfully.",
      );

      setAppointments((previous) =>
        previous.filter(
          (item) => item.id !== appointment.id,
        ),
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to start encounter.",
      );
    } finally {
      setStartingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Patient Queue
        </h1>

        <p className="text-muted-foreground mt-1">
          Patients ready for consultation
        </p>
      </div>

      {message && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-muted-foreground">
            Loading patients...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No patients waiting for consultation.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">
                    Patient
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Registration ID:{" "}
                    {appointment.patientHospitalId}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    Appointment:{" "}
                    {new Date(
                      appointment.startTime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-muted">
                    {appointment.status}
                  </span>
                </div>

                <button
                  onClick={() =>
                    startEncounter(appointment)
                  }
                  disabled={
                    startingId === appointment.id
                  }
                  className="rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium disabled:opacity-50"
                >
                  {startingId === appointment.id
                    ? "Starting..."
                    : "Start Consultation"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}