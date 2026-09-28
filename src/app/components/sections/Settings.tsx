import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Building,
  Palette,
} from "lucide-react";
import { HospitalManagement } from "./HospitalManagement";

export function SettingsSection() {
  const [activeSection, setActiveSection] = useState<
    "main" | "hospitals"
  >("main");

  if (activeSection === "hospitals") {
    return (
      <HospitalManagement
        onBack={() => setActiveSection("main")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage system configuration and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsCard
          title="Hospital Information"
          description="Manage hospital details and contact information"
          icon={Building}
          color="primary"
          onClick={() => setActiveSection("hospitals")}
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
        <h3 className="font-semibold text-foreground mb-4">
          Hospital Information
        </h3>

        <div className="space-y-4">
          <SettingField
            label="Hospital Name"
            value="Configure hospitals above"
          />

          <SettingField
            label="Contact Email"
            value="Configure hospitals above"
          />

          <SettingField
            label="Contact Phone"
            value="Configure hospitals above"
          />

          <SettingField
            label="Address"
            value="Configure hospitals above"
          />
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    destructive: "from-destructive/10 to-destructive/5 text-destructive",
    info: "from-info/10 to-info/5 text-info",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`text-left bg-card rounded-2xl border border-border p-6 shadow-sm transition-shadow ${
        onClick
          ? "hover:shadow-md cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} w-fit mb-4`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-semibold text-foreground mb-1">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </button>
  );
}

function SettingField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}