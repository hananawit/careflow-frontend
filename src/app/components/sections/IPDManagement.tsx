import { 
  Hospital, 
  Bed, 
  Plus,
  Search,
  User,
  Calendar,
  Activity,
  FileText
} from "lucide-react";

const mockIPDPatients = [
  { id: "I001", patient: "Olivia Brown", age: 10, ward: "Pediatric A", bed: "A-12", admissionDate: "2026-01-06", condition: "Post-Surgery Care", doctor: "Dr. Michael Chen", status: "stable" },
  { id: "I002", patient: "Ethan Anderson", age: 8, ward: "Pediatric B", bed: "B-05", admissionDate: "2026-01-07", condition: "Dental Infection Treatment", doctor: "Dr. Sarah Anderson", status: "improving" },
  { id: "I003", patient: "Mason Thomas", age: 6, ward: "Pediatric A", bed: "A-08", admissionDate: "2026-01-08", condition: "Orthodontic Surgery Recovery", doctor: "Dr. Jessica Taylor", status: "stable" },
];

const wardOccupancy = [
  { ward: "Pediatric A", total: 15, occupied: 8, available: 7 },
  { ward: "Pediatric B", total: 12, occupied: 5, available: 7 },
  { ward: "ICU", total: 4, occupied: 0, available: 4 },
];

export function IPDManagement() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">IPD Management</h1>
          <p className="text-muted-foreground">Manage inpatient admissions, wards, and bed allocation</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          New Admission
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <IPDCard label="Total Admissions" value="18" color="primary" icon={Hospital} />
        <IPDCard label="Occupied Beds" value="13" color="info" icon={Bed} />
        <IPDCard label="Available Beds" value="18" color="success" icon={Bed} />
        <IPDCard label="Discharges Today" value="2" color="warning" icon={Activity} />
      </div>

      {/* Ward Occupancy */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Ward Occupancy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wardOccupancy.map((ward) => (
            <div key={ward.ward} className="p-4 bg-muted/30 rounded-xl border border-border">
              <p className="font-semibold text-foreground mb-3">{ward.ward}</p>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(ward.occupied / ward.total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {ward.occupied}/{ward.total}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available: <span className="text-success font-semibold">{ward.available}</span></span>
                <span className="text-muted-foreground">Occupied: <span className="text-primary font-semibold">{ward.occupied}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Patients */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Current IPD Patients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">IPD ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ward & Bed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Admission Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Condition</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockIPDPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-semibold">{patient.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{patient.patient}</p>
                      <p className="text-sm text-muted-foreground">{patient.age} years</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{patient.ward}</p>
                      <p className="text-sm text-muted-foreground">Bed {patient.bed}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.admissionDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.condition}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{patient.doctor}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      patient.status === "stable" 
                        ? "bg-success/10 text-success" 
                        : "bg-info/10 text-info"
                    }`}>
                      {patient.status === "stable" ? "Stable" : "Improving"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nursing Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Recent Nursing Updates</h3>
          <div className="space-y-3">
            <NursingUpdate 
              patient="Olivia Brown" 
              update="Vital signs stable, temperature 98.6°F" 
              time="2 hours ago"
              nurse="Nurse Emily Parker"
            />
            <NursingUpdate 
              patient="Ethan Anderson" 
              update="Medication administered, no adverse reactions" 
              time="4 hours ago"
              nurse="Nurse Sarah Wilson"
            />
            <NursingUpdate 
              patient="Mason Thomas" 
              update="Pain level reduced, patient resting comfortably" 
              time="6 hours ago"
              nurse="Nurse Emily Parker"
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Scheduled Discharges</h3>
          <div className="space-y-3">
            <DischargeItem 
              patient="Olivia Brown" 
              date="2026-01-10" 
              doctor="Dr. Michael Chen"
            />
            <DischargeItem 
              patient="Mason Thomas" 
              date="2026-01-11" 
              doctor="Dr. Jessica Taylor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IPDCard({ 
  label, 
  value, 
  color, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  color: string; 
  icon: React.ElementType;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    info: "from-info/10 to-info/5 text-info",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function NursingUpdate({ 
  patient, 
  update, 
  time, 
  nurse 
}: { 
  patient: string; 
  update: string; 
  time: string; 
  nurse: string;
}) {
  return (
    <div className="p-4 bg-muted/30 rounded-xl">
      <div className="flex items-start gap-3">
        <Activity className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-foreground mb-1">{patient}</p>
          <p className="text-sm text-muted-foreground mb-2">{update}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{nurse}</span>
            <span>•</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DischargeItem({ patient, date, doctor }: { patient: string; date: string; doctor: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-success" />
        </div>
        <div>
          <p className="font-medium text-foreground">{patient}</p>
          <p className="text-sm text-muted-foreground">{doctor}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground">{date}</span>
    </div>
  );
}
