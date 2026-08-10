import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const revenueData = [
  { month: "Jul", revenue: 125000, expenses: 85000 },
  { month: "Aug", revenue: 142000, expenses: 92000 },
  { month: "Sep", revenue: 138000, expenses: 88000 },
  { month: "Oct", revenue: 165000, expenses: 95000 },
  { month: "Nov", revenue: 158000, expenses: 90000 },
  { month: "Dec", revenue: 175000, expenses: 98000 },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View comprehensive reports and insights</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard title="Revenue Report" description="Monthly financial overview" icon={TrendingUp} color="success" />
        <ReportCard title="Patient Statistics" description="Patient demographics & trends" icon={BarChart3} color="primary" />
        <ReportCard title="Department Performance" description="Service-wise analytics" icon={Calendar} color="info" />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Revenue vs Expenses (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0f2fe', borderRadius: '12px' }} />
            <Legend />
            <Bar dataKey="revenue" fill="#0891b2" radius={[8, 8, 0, 0]} name="Revenue" />
            <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <StatRow label="Total Patients Treated" value="1,248" />
            <StatRow label="Average Daily Revenue" value="₹12,450" />
            <StatRow label="Patient Satisfaction" value="4.8/5.0" />
            <StatRow label="Appointment Completion Rate" value="94%" />
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Top Treatments</h3>
          <div className="space-y-3">
            <TreatmentRow treatment="Cavity Filling" count={245} />
            <TreatmentRow treatment="Teeth Cleaning" count={198} />
            <TreatmentRow treatment="Regular Checkup" count={412} />
            <TreatmentRow treatment="Braces Adjustment" count={86} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon: Icon, color }: { title: string; description: string; icon: React.ElementType; color: string }) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    info: "from-info/10 to-info/5 text-info",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TreatmentRow({ treatment, count }: { treatment: string; count: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
      <span className="text-sm text-foreground">{treatment}</span>
      <span className="font-semibold text-primary">{count}</span>
    </div>
  );
}
