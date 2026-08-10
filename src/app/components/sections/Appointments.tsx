import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

// Mock appointments data
const mockAppointments = [
  { id: "A001", time: "09:00 AM", patient: "Emma Johnson", age: 8, type: "Cavity Filling", doctor: "Dr. Sarah Anderson", status: "completed" },
  { id: "A002", time: "09:30 AM", patient: "Liam Davis", age: 7, type: "Regular Checkup", doctor: "Dr. Sarah Anderson", status: "completed" },
  { id: "A003", time: "10:00 AM", patient: "Noah Williams", age: 6, type: "Regular Checkup", doctor: "Dr. Michael Chen", status: "in-progress" },
  { id: "A004", time: "10:30 AM", patient: "Olivia Brown", age: 10, type: "Braces Adjustment", doctor: "Dr. Michael Chen", status: "waiting" },
  { id: "A005", time: "11:00 AM", patient: "Sophia Martinez", age: 9, type: "Teeth Cleaning", doctor: "Dr. Jessica Taylor", status: "waiting" },
  { id: "A006", time: "11:30 AM", patient: "Ethan Anderson", age: 8, type: "Cavity Filling", doctor: "Dr. Sarah Anderson", status: "scheduled" },
  { id: "A007", time: "02:00 PM", patient: "Ava Wilson", age: 7, type: "Fluoride Treatment", doctor: "Dr. Jessica Taylor", status: "scheduled" },
  { id: "A008", time: "02:30 PM", patient: "Mason Thomas", age: 6, type: "First Visit", doctor: "Dr. Michael Chen", status: "scheduled" },
  { id: "A009", time: "03:00 PM", patient: "Isabella Garcia", age: 9, type: "X-Ray & Checkup", doctor: "Dr. Sarah Anderson", status: "scheduled" },
  { id: "A010", time: "03:30 PM", patient: "Lucas Rodriguez", age: 10, type: "Extraction", doctor: "Dr. Michael Chen", status: "scheduled" },
];

const doctors = [
  "All Doctors",
  "Dr. Sarah Anderson",
  "Dr. Michael Chen",
  "Dr. Jessica Taylor",
];

export function Appointments() {
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [currentDate] = useState(new Date());

  const filteredAppointments = selectedDoctor === "All Doctors" 
    ? mockAppointments 
    : mockAppointments.filter(apt => apt.doctor === selectedDoctor);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Appointments (OPD)</h1>
          <p className="text-muted-foreground">Manage outpatient appointments and schedules</p>
        </div>
        <button 
          onClick={() => setShowBookAppointment(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      {/* Date Navigator & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Today's Schedule</h3>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="px-4 py-2 bg-primary/10 rounded-lg">
                <p className="font-medium text-primary">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Doctor Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {doctors.map((doctor) => (
              <button
                key={doctor}
                onClick={() => setSelectedDoctor(doctor)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDoctor === doctor
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {doctor}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <QuickStat label="Total Appointments" value="24" color="primary" />
          <QuickStat label="Completed" value="12" color="success" />
        </div>
      </div>

      {/* Appointment Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <div className="space-y-4">
          <QueueCard
            title="Waiting"
            count={filteredAppointments.filter(a => a.status === "waiting").length}
            color="warning"
            icon={Clock}
          />
          <QueueCard
            title="In Progress"
            count={filteredAppointments.filter(a => a.status === "in-progress").length}
            color="info"
            icon={AlertCircle}
          />
          <QueueCard
            title="Completed"
            count={filteredAppointments.filter(a => a.status === "completed").length}
            color="success"
            icon={CheckCircle}
          />
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground">Appointment List</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <div className="divide-y divide-border">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Weekly Calendar View</h3>
        <WeeklyCalendar />
      </div>

      {/* Book Appointment Modal */}
      {showBookAppointment && (
        <BookAppointmentModal onClose={() => setShowBookAppointment(false)} />
      )}
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 border-primary/20 text-primary",
    success: "from-success/10 to-success/5 border-success/20 text-success",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function QueueCard({ 
  title, 
  count, 
  color, 
  icon: Icon 
}: { 
  title: string; 
  count: number; 
  color: string; 
  icon: React.ElementType;
}) {
  const colorClasses: Record<string, string> = {
    warning: "from-warning/10 to-warning/5 border-warning/20",
    info: "from-info/10 to-info/5 border-info/20",
    success: "from-success/10 to-success/5 border-success/20",
  };

  const iconColors: Record<string, string> = {
    warning: "text-warning",
    info: "text-info",
    success: "text-success",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground mb-1">{count}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <Icon className={`w-8 h-8 ${iconColors[color]}`} />
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: typeof mockAppointments[0] }) {
  const statusConfig = {
    completed: { bg: "bg-success/10", text: "text-success", label: "Completed" },
    "in-progress": { bg: "bg-info/10", text: "text-info", label: "In Progress" },
    waiting: { bg: "bg-warning/10", text: "text-warning", label: "Waiting" },
    scheduled: { bg: "bg-muted", text: "text-muted-foreground", label: "Scheduled" },
  };

  const config = statusConfig[appointment.status];

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-xl p-3 min-w-[80px]">
            <p className="text-sm font-semibold text-primary">{appointment.time}</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{appointment.patient}</h4>
              <span className="text-sm text-muted-foreground">({appointment.age} years)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{appointment.type}</p>
            <p className="text-sm text-muted-foreground">👨‍⚕️ {appointment.doctor}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
          {appointment.status === "waiting" && (
            <button className="text-sm text-primary hover:underline">Call Patient</button>
          )}
        </div>
      </div>
    </div>
  );
}

function WeeklyCalendar() {
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-2 mb-2">
          <div className="text-sm font-medium text-muted-foreground">Time</div>
          {days.map(day => (
            <div key={day} className="text-sm font-medium text-center text-foreground">{day}</div>
          ))}
        </div>
        {timeSlots.map((time, idx) => (
          <div key={time} className="grid grid-cols-7 gap-2 mb-2">
            <div className="text-sm text-muted-foreground py-2">{time}</div>
            {days.map((day, dayIdx) => {
              const hasAppointment = (idx + dayIdx) % 3 === 0;
              return (
                <div 
                  key={`${day}-${time}`} 
                  className={`rounded-lg p-2 text-xs ${
                    hasAppointment 
                      ? "bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20" 
                      : "bg-muted/30 border border-border"
                  } transition-colors`}
                >
                  {hasAppointment && (
                    <p className="font-medium text-primary truncate">Patient {idx + dayIdx}</p>
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

function BookAppointmentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Book New Appointment</h2>
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
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option>Select patient...</option>
                <option>Emma Johnson (P001)</option>
                <option>Noah Williams (P002)</option>
                <option>Olivia Brown (P003)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Doctor</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option>Select doctor...</option>
                <option>Dr. Sarah Anderson</option>
                <option>Dr. Michael Chen</option>
                <option>Dr. Jessica Taylor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Time</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Treatment Type</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option>Regular Checkup</option>
                <option>Cavity Filling</option>
                <option>Teeth Cleaning</option>
                <option>Braces Adjustment</option>
                <option>Extraction</option>
                <option>Fluoride Treatment</option>
                <option>X-Ray</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
              <textarea 
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                rows={3}
                placeholder="Any special notes or concerns..."
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
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
