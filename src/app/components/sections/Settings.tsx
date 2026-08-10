import { Settings as SettingsIcon, Bell, Lock, User, Building, Palette } from "lucide-react";

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsCard
          title="Hospital Information"
          description="Manage hospital details and contact information"
          icon={Building}
          color="primary"
        />
        <SettingsCard
          title="User Management"
          description="Manage user accounts and permissions"
          icon={User}
          color="success"
        />
        <SettingsCard
          title="Notifications"
          description="Configure notification preferences"
          icon={Bell}
          color="warning"
        />
        <SettingsCard
          title="Security & Access"
          description="Two-factor authentication and audit logs"
          icon={Lock}
          color="destructive"
        />
        <SettingsCard
          title="Appearance"
          description="Customize theme and display settings"
          icon={Palette}
          color="info"
        />
        <SettingsCard
          title="System Settings"
          description="General system configuration"
          icon={SettingsIcon}
          color="primary"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Hospital Information</h3>
        <div className="space-y-4">
          <SettingField label="Hospital Name" value="GTasteriX Child Dental Hospital" />
          <SettingField label="Contact Email" value="info@gtasterix.com" />
          <SettingField label="Contact Phone" value="+91 98765 00000" />
          <SettingField label="Address" value="123 Healthcare Street, Medical District, City - 400001" />
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, icon: Icon, color }: { title: string; description: string; icon: React.ElementType; color: string }) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    destructive: "from-destructive/10 to-destructive/5 text-destructive",
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

function SettingField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
