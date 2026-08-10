import { useState } from "react";
import { 
  FlaskConical, 
  Plus, 
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User
} from "lucide-react";

const mockLabTests = [
  { id: "L001", patient: "Emma Johnson", test: "Dental X-Ray (Panoramic)", doctor: "Dr. Sarah Anderson", date: "2026-01-09", status: "completed", priority: "normal" },
  { id: "L002", patient: "Noah Williams", test: "Blood Test (CBC)", doctor: "Dr. Michael Chen", date: "2026-01-09", status: "in-progress", priority: "normal" },
  { id: "L003", patient: "Olivia Brown", test: "Periapical X-Ray", doctor: "Dr. Jessica Taylor", date: "2026-01-09", status: "pending", priority: "urgent" },
  { id: "L004", patient: "Liam Davis", test: "Bitewing X-Ray", doctor: "Dr. Sarah Anderson", date: "2026-01-08", status: "completed", priority: "normal" },
  { id: "L005", patient: "Sophia Martinez", test: "Allergy Test", doctor: "Dr. Michael Chen", date: "2026-01-08", status: "completed", priority: "normal" },
];

export function Laboratory() {
  const [showBookTest, setShowBookTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const pendingTests = mockLabTests.filter(t => t.status === "pending").length;
  const inProgressTests = mockLabTests.filter(t => t.status === "in-progress").length;
  const completedToday = mockLabTests.filter(t => t.status === "completed" && t.date === "2026-01-09").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Laboratory Management</h1>
          <p className="text-muted-foreground">Manage lab tests, samples, and reports</p>
        </div>
        <button 
          onClick={() => setShowBookTest(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Book Lab Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <LabCard
          label="Pending Tests"
          value={pendingTests.toString()}
          icon={Clock}
          color="warning"
        />
        <LabCard
          label="In Progress"
          value={inProgressTests.toString()}
          icon={AlertCircle}
          color="info"
        />
        <LabCard
          label="Completed Today"
          value={completedToday.toString()}
          icon={CheckCircle}
          color="success"
        />
        <LabCard
          label="Total Tests"
          value={mockLabTests.length.toString()}
          icon={FlaskConical}
          color="primary"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by test ID, patient name, test type..."
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Priority</option>
            <option>Urgent</option>
            <option>Normal</option>
          </select>
        </div>
      </div>

      {/* Lab Tests Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Test ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Test Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Requested By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockLabTests.map((test) => (
                <tr key={test.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-semibold">{test.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{test.patient}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{test.test}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{test.doctor}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{test.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      test.priority === "urgent"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {test.priority === "urgent" ? "Urgent" : "Normal"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      test.status === "completed"
                        ? "bg-success/10 text-success"
                        : test.status === "in-progress"
                        ? "bg-info/10 text-info"
                        : "bg-warning/10 text-warning"
                    }`}>
                      {test.status === "completed" ? "Completed" : test.status === "in-progress" ? "In Progress" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedTest(test.id)}
                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {test.status === "completed" && (
                        <button className="p-2 hover:bg-success/10 rounded-lg text-success transition-colors" title="Download Report">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Tests */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Available Lab Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TestTypeCard name="Dental X-Ray (Panoramic)" price={1500} duration="15 mins" />
          <TestTypeCard name="Periapical X-Ray" price={800} duration="10 mins" />
          <TestTypeCard name="Bitewing X-Ray" price={600} duration="10 mins" />
          <TestTypeCard name="Blood Test (CBC)" price={500} duration="30 mins" />
          <TestTypeCard name="Allergy Test" price={2000} duration="45 mins" />
          <TestTypeCard name="Cephalometric X-Ray" price={1200} duration="20 mins" />
        </div>
      </div>

      {/* Book Test Modal */}
      {showBookTest && (
        <BookTestModal onClose={() => setShowBookTest(false)} />
      )}

      {/* Test Details Modal */}
      {selectedTest && (
        <TestDetailsModal 
          testId={selectedTest} 
          onClose={() => setSelectedTest(null)} 
        />
      )}
    </div>
  );
}

function LabCard({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType; 
  color: string;
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

function TestTypeCard({ name, price, duration }: { name: string; price: number; duration: string }) {
  return (
    <div className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-border">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground mb-1">{name}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>₹{price}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookTestModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Book Lab Test</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Patient</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select patient...</option>
                <option>Emma Johnson (P001)</option>
                <option>Noah Williams (P002)</option>
                <option>Olivia Brown (P003)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Test Type</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select test...</option>
                <option>Dental X-Ray (Panoramic)</option>
                <option>Periapical X-Ray</option>
                <option>Bitewing X-Ray</option>
                <option>Blood Test (CBC)</option>
                <option>Allergy Test</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Requested By</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select doctor...</option>
                <option>Dr. Sarah Anderson</option>
                <option>Dr. Michael Chen</option>
                <option>Dr. Jessica Taylor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Clinical Notes</label>
              <textarea
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="Any special instructions or clinical notes..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
              Book Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestDetailsModal({ testId, onClose }: { testId: string; onClose: () => void }) {
  const test = mockLabTests.find(t => t.id === testId);
  
  if (!test) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Test Details - {test.id}</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Patient</p>
                <p className="font-semibold text-foreground">{test.patient}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Test Type</p>
                <p className="font-semibold text-foreground">{test.test}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Requested By</p>
                <p className="font-semibold text-foreground">{test.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-foreground">{test.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                  test.priority === "urgent" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                }`}>
                  {test.priority === "urgent" ? "Urgent" : "Normal"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                  test.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {test.status === "completed" ? "Completed" : test.status === "in-progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {test.status === "completed" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Test Report
              </h3>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Report Summary</p>
                  <p className="text-foreground">
                    X-Ray examination completed. No significant abnormalities detected. 
                    Dental development appears normal for age. Recommend follow-up in 6 months.
                  </p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all">
                  <Download className="w-5 h-5" />
                  Download Full Report (PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
