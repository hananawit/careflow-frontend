import { Search, Bell, User, ChevronDown } from "lucide-react";

export function Header() {
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
