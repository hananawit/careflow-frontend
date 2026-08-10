import { 
  Users, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  TrendingUp, 
  UserPlus, 
  CalendarPlus, 
  FileText,
  Activity,
  Bed,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, patients: 120 },
  { month: "Feb", revenue: 52000, patients: 145 },
  { month: "Mar", revenue: 48000, patients: 132 },
  { month: "Apr", revenue: 61000, patients: 168 },
  { month: "May", revenue: 55000, patients: 152 },
  { month: "Jun", revenue: 67000, patients: 185 },
];

const patientFlowData = [
  { day: "Mon", opd: 32, ipd: 8 },
  { day: "Tue", opd: 28, ipd: 12 },
  { day: "Wed", opd: 35, ipd: 10 },
  { day: "Thu", opd: 30, ipd: 9 },
  { day: "Fri", opd: 38, ipd: 11 },
  { day: "Sat", opd: 25, ipd: 7 },
  { day: "Sun", opd: 15, ipd: 5 },
];

const treatmentDistribution = [
  { name: "Cavity Filling", value: 35, color: "#0891b2" },
  { name: "Cleaning", value: 25, color: "#10b981" },
  { name: "Extraction", value: 15, color: "#f59e0b" },
  { name: "Braces", value: 15, color: "#8b5cf6" },
  { name: "Others", value: 10, color: "#ec4899" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Today's Appointments"
          value="24"
          change="+12%"
          icon={Calendar}
          color="primary"
          subtitle="5 pending"
        />
        <KPICard
          title="OPD Patients"
          value="156"
          change="+8%"
          icon={Users}
          color="success"
          subtitle="This week"
        />
        <KPICard
          title="IPD Patients"
          value="18"
          change="-3%"
          icon={Bed}
          color="info"
          subtitle="Currently admitted"
        />
        <KPICard
          title="Revenue (Today)"
          value="₹12,450"
          change="+15%"
          icon={DollarSign}
          color="warning"
          subtitle="8 bills pending"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            icon={UserPlus}
            label="Add New Patient"
            color="primary"
          />
          <QuickActionButton
            icon={CalendarPlus}
            label="Book Appointment"
            color="success"
          />
          <QuickActionButton
            icon={FileText}
            label="Generate Bill"
            color="warning"
          />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Monthly Revenue & Patients</h3>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e0f2fe',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0891b2" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Flow Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Weekly Patient Flow</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e0f2fe',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="opd" fill="#0891b2" radius={[8, 8, 0, 0]} name="OPD" />
              <Bar dataKey="ipd" fill="#10b981" radius={[8, 8, 0, 0]} name="IPD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treatment Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Treatment Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={treatmentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {treatmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {treatmentDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            <AppointmentItem
              time="09:00 AM"
              patient="Emma Johnson"
              age="8 years"
              type="Cavity Filling"
              status="completed"
            />
            <AppointmentItem
              time="10:30 AM"
              patient="Noah Williams"
              age="6 years"
              type="Regular Checkup"
              status="in-progress"
            />
            <AppointmentItem
              time="11:15 AM"
              patient="Olivia Brown"
              age="10 years"
              type="Braces Adjustment"
              status="waiting"
            />
            <AppointmentItem
              time="02:00 PM"
              patient="Liam Davis"
              age="7 years"
              type="Teeth Cleaning"
              status="scheduled"
            />
            <AppointmentItem
              time="03:30 PM"
              patient="Sophia Martinez"
              age="9 years"
              type="Extraction"
              status="scheduled"
            />
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Pending Actions</h3>
          </div>
          <div className="space-y-3">
            <AlertItem text="8 bills pending payment" severity="warning" />
            <AlertItem text="3 lab reports ready for review" severity="info" />
            <AlertItem text="Dental equipment maintenance due" severity="warning" />
            <AlertItem text="2 medicines low in stock" severity="error" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Staff on Duty</h3>
          </div>
          <div className="space-y-3">
            <StaffItem name="Dr. Sarah Anderson" role="Pediatric Dentist" status="available" />
            <StaffItem name="Dr. Michael Chen" role="Orthodontist" status="busy" />
            <StaffItem name="Nurse Emily Parker" role="Dental Nurse" status="available" />
            <StaffItem name="Dr. Jessica Taylor" role="Oral Surgeon" status="available" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: "primary" | "success" | "warning" | "info";
  subtitle: string;
}

function KPICard({ title, value, change, icon: Icon, color, subtitle }: KPICardProps) {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    info: "from-info/10 to-info/5 text-info",
  };

  const isPositive = change.startsWith("+");

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
          isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  color: "primary" | "success" | "warning";
}

function QuickActionButton({ icon: Icon, label, color }: QuickActionButtonProps) {
  const colorClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    success: "bg-success hover:bg-success/90 text-success-foreground",
    warning: "bg-warning hover:bg-warning/90 text-warning-foreground",
  };

  return (
    <button className={`flex items-center gap-3 px-6 py-4 rounded-xl ${colorClasses[color]} transition-all shadow-md hover:shadow-lg`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface AppointmentItemProps {
  time: string;
  patient: string;
  age: string;
  type: string;
  status: "completed" | "in-progress" | "waiting" | "scheduled";
}

function AppointmentItem({ time, patient, age, type, status }: AppointmentItemProps) {
  const statusColors = {
    completed: "bg-success/10 text-success",
    "in-progress": "bg-primary/10 text-primary",
    waiting: "bg-warning/10 text-warning",
    scheduled: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    completed: "Completed",
    "in-progress": "In Progress",
    waiting: "Waiting",
    scheduled: "Scheduled",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">{time}</p>
        </div>
        <div>
          <p className="font-medium text-foreground">{patient}</p>
          <p className="text-sm text-muted-foreground">{age} • {type}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
}

interface AlertItemProps {
  text: string;
  severity: "error" | "warning" | "info";
}

function AlertItem({ text, severity }: AlertItemProps) {
  const severityColors = {
    error: "bg-destructive/10 border-destructive/20 text-destructive",
    warning: "bg-warning/10 border-warning/20 text-warning",
    info: "bg-info/10 border-info/20 text-info",
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${severityColors[severity]}`}>
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

interface StaffItemProps {
  name: string;
  role: string;
  status: "available" | "busy";
}

function StaffItem({ name, role, status }: StaffItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
      <div>
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === "available" ? "bg-success" : "bg-warning"
        }`} />
        <span className="text-sm text-muted-foreground capitalize">{status}</span>
      </div>
    </div>
  );
}
