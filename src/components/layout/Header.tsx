import { CalendarIcon, Settings, Bell, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <CalendarIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">BudgetFlow</h1>
          <p className="text-xs text-muted-foreground">Smart Financial Planning</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};