import { Building2, Search, Bell, User, ChevronDown } from "lucide-react";
import { useHospitalContext } from "../../context/HospitalContext";

export function Header() {
  const {
    hospitals,
    currentHospital,
    isLoading: hospitalsLoading,
    error: hospitalsError,
    selectHospital,
  } = useHospitalContext();

  return (
    <header className="h-16 bg-card border-b border-border fixed top-0 right-0 left-64 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients, appointments, records..."
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden min-w-52 md:block">
            <label className="sr-only" htmlFor="current-hospital">
              Current hospital
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="current-hospital"
                value={currentHospital?.id ?? ""}
                onChange={(event) => selectHospital(event.target.value)}
                disabled={hospitalsLoading || hospitals.length === 0}
                className="h-10 w-full appearance-none rounded-md border border-border bg-input-background py-2 pl-9 pr-8 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {hospitalsLoading && <option>Loading hospitals...</option>}
                {!hospitalsLoading && hospitals.length === 0 && (
                  <option>{hospitalsError ?? "No active hospitals"}</option>
                )}
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Dr. Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
