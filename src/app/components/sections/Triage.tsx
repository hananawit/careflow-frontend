import { useState } from "react";
import {
  createTriage,
  type CreateTriageDto,
} from "../../../services/triage.service";

export function Triage() {
  const [form, setForm] = useState<CreateTriageDto>({
    chiefComplaint: "",
    priority: "STANDARD",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTriageDto, string>>
>({});
const handleChange = (
  field: keyof CreateTriageDto,
  value: string,
) => {
  setForm((previous) => ({
    ...previous,
    [field]: value,
  }));

  // Live validation
  setErrors((previous) => {
    const nextErrors = { ...previous };

    if (field === "chiefComplaint") {
      if (!value.trim()) {
        nextErrors.chiefComplaint =
          "Chief complaint is required.";
      } else {
        delete nextErrors.chiefComplaint;
      }
    }

    if (field === "notes") {
      delete nextErrors.notes;
    }

    return nextErrors;
  });
};
const handleNumberChange = (
  field: keyof CreateTriageDto,
  value: string,
) => {
  const numericValue =
    value === "" ? undefined : Number(value);

  setForm((previous) => ({
    ...previous,
    [field]: numericValue,
  }));

  // Live validation
  setErrors((previous) => {
    const nextErrors = { ...previous };

    // Empty is allowed because these fields are optional
    if (value === "") {
      delete nextErrors[field];
      return nextErrors;
    }

    let error = "";

    switch (field) {
      case "systolicBP":
        if (
          numericValue! < 50 ||
          numericValue! > 250
        ) {
          error =
            "Systolic BP must be between 50 and 250 mmHg.";
        }
        break;

      case "diastolicBP":
        if (
          numericValue! < 30 ||
          numericValue! > 150
        ) {
          error =
            "Diastolic BP must be between 30 and 150 mmHg.";
        }
        break;

      case "pulse":
        if (
          numericValue! < 20 ||
          numericValue! > 250
        ) {
          error =
            "Pulse must be between 20 and 250 bpm.";
        }
        break;

      case "respiratoryRate":
        if (
          numericValue! < 5 ||
          numericValue! > 80
        ) {
          error =
            "Respiratory rate must be between 5 and 80 breaths/min.";
        }
        break;

      case "temperature":
        if (
          numericValue! < 30 ||
          numericValue! > 45
        ) {
          error =
            "Temperature must be between 30°C and 45°C.";
        }
        break;

      case "oxygenSaturation":
        if (
          numericValue! < 0 ||
          numericValue! > 100
        ) {
          error =
            "Oxygen saturation must be between 0% and 100%.";
        }
        break;

      case "weight":
        if (numericValue! <= 0) {
          error =
            "Weight must be greater than 0 kg.";
        }
        break;

      case "height":
        if (numericValue! <= 0) {
          error =
            "Height must be greater than 0 m.";
        }
        break;

      case "painScore":
        if (
          numericValue! < 0 ||
          numericValue! > 10
        ) {
          error =
            "Pain score must be between 0 and 10.";
        }
        break;
    }

    if (error) {
      nextErrors[field] = error;
    } else {
      delete nextErrors[field];
    }

    return nextErrors;
  });
};
const validateForm = () => {
  const newErrors: Partial<
    Record<keyof CreateTriageDto, string>
  > = {};

  // Chief complaint
  if (!form.chiefComplaint.trim()) {
    newErrors.chiefComplaint =
      "Chief complaint is required.";
  }

  // Systolic BP
  if (
    form.systolicBP !== undefined &&
    (form.systolicBP < 50 || form.systolicBP > 250)
  ) {
    newErrors.systolicBP =
      "Systolic BP must be between 50 and 250 mmHg.";
  }

  // Diastolic BP
  if (
    form.diastolicBP !== undefined &&
    (form.diastolicBP < 30 || form.diastolicBP > 150)
  ) {
    newErrors.diastolicBP =
      "Diastolic BP must be between 30 and 150 mmHg.";
  }

  // Pulse
  if (
    form.pulse !== undefined &&
    (form.pulse < 20 || form.pulse > 250)
  ) {
    newErrors.pulse =
      "Pulse must be between 20 and 250 bpm.";
  }

  // Respiratory rate
  if (
    form.respiratoryRate !== undefined &&
    (form.respiratoryRate < 5 ||
      form.respiratoryRate > 80)
  ) {
    newErrors.respiratoryRate =
      "Respiratory rate must be between 5 and 80 breaths/min.";
  }

  // Temperature
  if (
    form.temperature !== undefined &&
    (form.temperature < 30 ||
      form.temperature > 45)
  ) {
    newErrors.temperature =
      "Temperature must be between 30°C and 45°C.";
  }

  // Oxygen saturation
  if (
    form.oxygenSaturation !== undefined &&
    (form.oxygenSaturation < 0 ||
      form.oxygenSaturation > 100)
  ) {
    newErrors.oxygenSaturation =
      "Oxygen saturation must be between 0% and 100%.";
  }

  // Weight
  if (
    form.weight !== undefined &&
    form.weight <= 0
  ) {
    newErrors.weight =
      "Weight must be greater than 0 kg.";
  }

  // Height
  if (
    form.height !== undefined &&
    form.height <= 0
  ) {
    newErrors.height =
      "Height must be greater than 0 m.";
  }

  // Pain score
  if (
    form.painScore !== undefined &&
    (form.painScore < 0 ||
      form.painScore > 10)
  ) {
    newErrors.painScore =
      "Pain score must be between 0 and 10.";
  }

  return newErrors;
};
const handleSubmit = async (
  event: React.FormEvent,
) => {
  event.preventDefault();

  // Validate before calling the API
  const validationErrors = validateForm();

  setErrors(validationErrors);
  setMessage("");

  // Stop if there are validation errors
  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  try {
    setLoading(true);

    const result = await createTriage(form);

    console.log("Triage created:", result);

    setMessage(
      `Triage saved successfully. BMI: ${
        result.bmi ?? "N/A"
      }`,
    );

    setForm({
      chiefComplaint: "",
      priority: "STANDARD",
    });

    setErrors({});
  } catch (error) {
    console.error(error);
    setMessage("Failed to save triage.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Triage
        </h1>

        <p className="text-muted-foreground mt-1">
          Record patient symptoms and vital signs.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 space-y-6"      >
        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Chief Complaint
          </label>

<textarea
  value={form.chiefComplaint}
  onChange={(event) =>
    handleChange(
      "chiefComplaint",
      event.target.value,
    )
  }
  rows={3}
  className="w-full rounded-xl border border-border bg-background px-4 py-3"
  placeholder="Why is the patient here?"
/>

{errors.chiefComplaint && (
  <p className="mt-1 text-sm text-destructive">
    {errors.chiefComplaint}
  </p>
)}
        </div>

        {/* Vital Signs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Vital Signs
          </h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberField
              label="Systolic BP"
              value={form.systolicBP}
              error={errors.systolicBP}
              onChange={(value) =>
                handleNumberChange("systolicBP", value)
              }
            />

            <NumberField
              label="Diastolic BP"
              value={form.diastolicBP}
              onChange={(value) =>
                handleNumberChange("diastolicBP", value)
              }
            />

            <NumberField
              label="Pulse"
              value={form.pulse}
              error={errors.pulse}
              onChange={(value) =>
                handleNumberChange("pulse", value)
              }
            />

            <NumberField
              label="Respiratory Rate"
              value={form.respiratoryRate}
              error={errors.respiratoryRate}
              onChange={(value) =>
                handleNumberChange(
                  "respiratoryRate",
                  value,
                )
              }
            />

            <NumberField
              label="Temperature"
              value={form.temperature}
              error={errors.temperature}
              step="0.1"
              onChange={(value) =>
                handleNumberChange(
                  "temperature",
                  value,
                )
              }
            />

            <NumberField
              label="Oxygen Saturation"
              value={form.oxygenSaturation}
              error={errors.oxygenSaturation}
              onChange={(value) =>
                handleNumberChange(
                  "oxygenSaturation",
                  value,
                )
              }
            />

            <NumberField
              label="Weight (kg)"
              value={form.weight}
              error={errors.weight}
              step="0.1"
              onChange={(value) =>
                handleNumberChange("weight", value)
              }
            />

            <NumberField
              label="Height (m)"
              value={form.height}
              error={errors.height}
              step="0.01"
              onChange={(value) =>
                handleNumberChange("height", value)
              }
            />

            <NumberField
              label="Pain Score (0–10)"
              value={form.painScore}
              min="0"
              max="10"
              error={errors.painScore}

              onChange={(value) =>
                handleNumberChange("painScore", value)
              }
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Priority
          </label>

          <select
            value={form.priority}
            onChange={(event) =>
              handleChange(
                "priority",
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
          >
            <option value="EMERGENCY">Emergency</option>
            <option value="VERY_URGENT">Very Urgent</option>
            <option value="URGENT">Urgent</option>
            <option value="STANDARD">Standard</option>
            <option value="NON_URGENT">Non Urgent</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes
          </label>

          <textarea
            value={form.notes ?? ""}
            onChange={(event) =>
              handleChange("notes", event.target.value)
            }
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
            placeholder="Additional observations..."
          />
        </div>

        {/* Result */}
        {message && (
          <div className="rounded-xl bg-muted px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Triage"}
          </button>
        </div>
      </form>
    </div>
  );
}


interface NumberFieldProps {
  label: string;
  value?: number | null;
  step?: string;
  min?: string;
  max?: string;
  error?: string;
  onChange: (value: string) => void;
}
function NumberField({
  label,
  value,
  step = "1",
  min,
  max,
  error,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type="number"
        value={value ?? ""}
        step={step}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`w-full rounded-xl border bg-background px-4 py-3 ${
          error
            ? "border-destructive focus:outline-none"
            : "border-border"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}