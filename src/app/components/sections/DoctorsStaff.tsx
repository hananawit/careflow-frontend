import { Stethoscope, User, Calendar, Clock, Mail, Phone } from "lucide-react";

const staff = [
  { id: "D001", name: "Dr. Sarah Anderson", role: "Pediatric Dentist", department: "Dentistry", email: "sarah.a@gtasterix.com", phone: "+91 98765 12345", status: "available", shift: "Morning" },
  { id: "D002", name: "Dr. Michael Chen", role: "Orthodontist", department: "Orthodontics", email: "michael.c@gtasterix.com", phone: "+91 98765 12346", status: "busy", shift: "Full Day" },
  { id: "D003", name: "Dr. Jessica Taylor", role: "Oral Surgeon", department: "Surgery", email: "jessica.t@gtasterix.com", phone: "+91 98765 12347", status: "available", shift: "Afternoon" },
  { id: "N001", name: "Nurse Emily Parker", role: "Dental Nurse", department: "Nursing", email: "emily.p@gtasterix.com", phone: "+91 98765 12348", status: "available", shift: "Morning" },
];

export function DoctorsStaff() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Doctors & Staff</h1>
        <p className="text-muted-foreground">Manage medical staff, schedules, and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard label="Total Doctors" value="8" color="primary" />
        <StatsCard label="Nurses" value="12" color="success" />
        <StatsCard label="On Duty Today" value="15" color="info" />
        <StatsCard label="Available Now" value="10" color="warning" />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Staff ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4"><span className="font-mono text-sm text-primary font-semibold">{member.id}</span></td>
                  <td className="px-6 py-4"><p className="font-medium text-foreground">{member.name}</p></td>
                  <td className="px-6 py-4"><span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">{member.role}</span></td>
                  <td className="px-6 py-4"><p className="text-sm text-foreground">{member.department}</p></td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.phone}</p>
                  </td>
                  <td className="px-6 py-4"><p className="text-sm text-foreground">{member.shift}</p></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.status === "available" ? "bg-success" : "bg-warning"}`} />
                      <span className="text-sm capitalize">{member.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 border-primary/20",
    success: "from-success/10 to-success/5 border-success/20",
    info: "from-info/10 to-info/5 border-info/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6`}>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
