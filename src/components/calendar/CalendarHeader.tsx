import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  monthData: {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  };
}

export const CalendarHeader = ({ currentDate, onDateChange, monthData }: CalendarHeaderProps) => {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1)
      : addMonths(currentDate, 1);
    onDateChange(newDate);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6 fade-in-glass">
      {/* Glassmorphic Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <p className="text-muted-foreground text-base">
            Financial overview for {format(currentDate, "MMMM")}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-500 hover:scale-110 neon-glow"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>
          
          <button
            onClick={() => onDateChange(new Date())}
            className="neon-button-secondary text-base px-6 py-3"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-500 hover:scale-110 neon-glow"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Glassmorphic Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 float">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/30 rounded-2xl flex items-center justify-center neon-glow">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Income</span>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(monthData.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 float-delayed">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-destructive/30 rounded-2xl flex items-center justify-center neon-glow">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Expenses</span>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(monthData.totalExpense)}
              </p>
            </div>
          </div>
        </div>

        <div className={`glass-card p-6 float-slow ${
          monthData.netAmount >= 0 
            ? 'border-primary/60' 
            : 'border-warning/60'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center neon-glow ${
              monthData.netAmount >= 0 ? 'bg-primary/30' : 'bg-warning/30'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                monthData.netAmount >= 0 ? 'text-primary' : 'text-warning'
              }`} />
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground">Net</span>
              <p className={`text-2xl font-bold ${
                monthData.netAmount >= 0 ? 'text-primary' : 'text-warning'
              }`}>
                {formatCurrency(monthData.netAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};