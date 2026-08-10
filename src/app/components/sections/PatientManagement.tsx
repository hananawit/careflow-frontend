import { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Upload
} from "lucide-react";

// Mock patient data
const mockPatients = [
  {
    id: "P001",
    name: "Emma Johnson",
    age: 8,
    gender: "Female",
    parent: "Sarah Johnson",
    phone: "+91 98765 43210",
    lastVisit: "2026-01-05",
    nextAppointment: "2026-01-15",
    status: "Active",
  },
  {
    id: "P002",
    name: "Noah Williams",
    age: 6,
    gender: "Male",
    parent: "Michael Williams",
    phone: "+91 98765 43211",
    lastVisit: "2026-01-08",
    nextAppointment: "2026-01-20",
    status: "Active",
  },
  {
    id: "P003",
    name: "Olivia Brown",
    age: 10,
    gender: "Female",
    parent: "Jessica Brown",
    phone: "+91 98765 43212",
    lastVisit: "2026-01-03",
    nextAppointment: null,
    status: "Active",
  },
  {
    id: "P004",
    name: "Liam Davis",
    age: 7,
    gender: "Male",
    parent: "Robert Davis",
    phone: "+91 98765 43213",
    lastVisit: "2025-12-28",
    nextAppointment: "2026-01-18",
    status: "Active",
  },
  {
    id: "P005",
    name: "Sophia Martinez",
    age: 9,
    gender: "Female",
    parent: "Maria Martinez",
    phone: "+91 98765 43214",
    lastVisit: "2026-01-06",
    nextAppointment: "2026-01-22",
    status: "Active",
  },
];

export function PatientManagement() {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Management</h1>
          <p className="text-muted-foreground">Manage patient records and medical history</p>
        </div>
        <button 
          onClick={() => setShowAddPatient(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, parent name..."
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Patients" value="1,248" color="primary" />
        <StatCard label="Active Patients" value="892" color="success" />
        <StatCard label="New This Month" value="43" color="info" />
        <StatCard label="Pending Follow-ups" value="28" color="warning" />
      </div>

      {/* Patient Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Parent/Guardian</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Visit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Next Appointment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-semibold">{patient.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.age} years • {patient.gender}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.parent}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.lastVisit}</p>
                  </td>
                  <td className="px-6 py-4">
                    {patient.nextAppointment ? (
                      <p className="text-sm text-foreground">{patient.nextAppointment}</p>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-success/10 text-success">
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedPatient(patient.id)}
                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Medical Records">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Add New Patient</h2>
              <button 
                onClick={() => setShowAddPatient(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Child Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Child Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Full Name" placeholder="Enter child's name" />
                  <InputField label="Date of Birth" type="date" />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                    <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <InputField label="Blood Group" placeholder="A+, B+, O+, etc." />
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-success" />
                  Parent/Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Parent/Guardian Name" placeholder="Enter name" />
                  <InputField label="Relationship" placeholder="Mother, Father, etc." />
                  <InputField label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" />
                  <InputField label="Email Address" type="email" placeholder="email@example.com" />
                  <div className="md:col-span-2">
                    <InputField label="Address" placeholder="Enter complete address" />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning" />
                  Medical & Dental History
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Allergies</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={2}
                      placeholder="List any allergies..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Previous Dental Issues</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={2}
                      placeholder="Describe any previous dental problems..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Current Medications</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={2}
                      placeholder="List current medications..."
                    />
                  </div>
                </div>
              </div>

              {/* Upload Documents */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-info" />
                  Upload Documents
                </h3>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">Previous medical records, X-rays, etc. (Max 10MB)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                <button 
                  onClick={() => setShowAddPatient(false)}
                  className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                  Save Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal 
          patientId={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 border-primary/20",
    success: "from-success/10 to-success/5 border-success/20",
    info: "from-info/10 to-info/5 border-info/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function InputField({ 
  label, 
  type = "text", 
  placeholder 
}: { 
  label: string; 
  type?: string; 
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
    </div>
  );
}

function PatientDetailsModal({ patientId, onClose }: { patientId: string; onClose: () => void }) {
  const patient = mockPatients.find(p => p.id === patientId);
  
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Patient Details - {patient.id}</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Patient Info Card */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                <User className="w-12 h-12" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">{patient.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-medium text-foreground font-mono">{patient.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parent/Guardian</p>
                    <p className="font-medium text-foreground">{patient.parent}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-medium text-foreground">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-success/10 text-success">
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Medical History</h3>
            <div className="space-y-3">
              <DetailRow label="Allergies" value="None reported" />
              <DetailRow label="Blood Group" value="A+" />
              <DetailRow label="Previous Dental Issues" value="Cavity (treated in 2024)" />
              <DetailRow label="Current Medications" value="None" />
            </div>
          </div>

          {/* Treatment History */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Treatment History</h3>
            <div className="space-y-3">
              <TreatmentItem 
                date="2026-01-05" 
                treatment="Regular Checkup & Cleaning" 
                doctor="Dr. Sarah Anderson" 
              />
              <TreatmentItem 
                date="2025-11-20" 
                treatment="Cavity Filling - Molar #2" 
                doctor="Dr. Michael Chen" 
              />
              <TreatmentItem 
                date="2025-08-15" 
                treatment="Fluoride Treatment" 
                doctor="Dr. Sarah Anderson" 
              />
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Upcoming Appointments</h3>
            {patient.nextAppointment ? (
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{patient.nextAppointment}</p>
                  <p className="text-sm text-muted-foreground">Regular Checkup</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function TreatmentItem({ date, treatment, doctor }: { date: string; treatment: string; doctor: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
      <FileText className="w-5 h-5 text-primary mt-1" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{treatment}</p>
        <p className="text-sm text-muted-foreground">{date} • {doctor}</p>
      </div>
    </div>
  );
}
