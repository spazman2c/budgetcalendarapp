import { CalendarIcon, Settings, Bell, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-8 fade-in">
      {/* Apple-style Logo */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-sm">
          <CalendarIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">BudgetFlow</h1>
          <p className="text-sm text-muted-foreground">Smart Financial Planning</p>
        </div>
      </div>

      {/* Apple-style Actions */}
      <div className="flex items-center space-x-2">
        <button className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};