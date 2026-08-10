import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Hospital, 
  Stethoscope, 
  CreditCard, 
  Pill, 
  FlaskConical, 
  Package, 
  BarChart3, 
  Settings,
  Sparkles 
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patient Management", icon: Users },
  { id: "appointments", label: "Appointments (OPD)", icon: Calendar },
  { id: "ipd", label: "IPD Management", icon: Hospital },
  { id: "doctors", label: "Doctors & Staff", icon: Stethoscope },
  { id: "billing", label: "Billing & Finance", icon: CreditCard },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-sidebar-border h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">CareFlow </h1>
            <p className="text-xs text-muted-foreground">Smart Healthcare Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
        <p className="text-xs text-muted-foreground text-center">
          CareFlow  Pvt Ltd © 2026
        </p>
      </div>
    </aside>
  );
}
