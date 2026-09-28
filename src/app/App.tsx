import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/sections/Dashboard";
import { PatientManagement } from "./components/sections/PatientManagement";
import { Appointments } from "./components/sections/Appointments";
import { IPDManagement } from "./components/sections/IPDManagement";
import { DoctorsStaff } from "./components/sections/DoctorsStaff";
import { Billing } from "./components/sections/Billing";
import { Pharmacy } from "./components/sections/Pharmacy";
import { Laboratory } from "./components/sections/Laboratory";
import { Inventory } from "./components/sections/Inventory";
import { Reports } from "./components/sections/Reports";
import { SettingsSection } from "./components/sections/Settings";import { Triage } from "./components/sections/Triage";
import { Consultation } from "./components/sections/Consultation";
import { Documents } from "./components/sections/Documents";
import { Encounter } from "./components/sections/Encounter";
import { WorkflowConfiguration } from "./components/sections/WorkflowConfiguration";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <PatientManagement />;
      case "appointments":
        return <Appointments />;
      case "ipd":
        return <IPDManagement />;
      case "staff":
        return <DoctorsStaff />;
      case "doctors":
        return <DoctorsStaff />;
      case "billing":
        return <Billing />;
      case "pharmacy":
        return <Pharmacy />;
      case "laboratory":
        return <Laboratory />;
      case "inventory":
        return <Inventory />;
      case "triage":
        return <Triage />;
      case "encounter":
        return <Encounter />;
      case "consultation":
        return <Consultation />;
      case "documents":
        return <Documents />;
      case "reports":
        return <Reports />;
      case "settings":
        return <SettingsSection />;
      case "workflow-configuration":
        return <WorkflowConfiguration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <Header />
      <main className="ml-64 mt-16 p-6">
        {renderSection()}
      </main>
    </div>
  );
}
