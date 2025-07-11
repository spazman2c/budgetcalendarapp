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
    <div className="space-y-6 fade-in">
      {/* Apple-style Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-foreground tracking-tight">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <p className="text-muted-foreground text-lg">
            Financial overview for {format(currentDate, "MMMM")}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>
          
          <button
            onClick={() => onDateChange(new Date())}
            className="apple-button-secondary"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Apple-style Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Income</span>
              <p className="text-3xl font-semibold text-success">
                {formatCurrency(monthData.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Expenses</span>
              <p className="text-3xl font-semibold text-destructive">
                {formatCurrency(monthData.totalExpense)}
              </p>
            </div>
          </div>
        </div>

        <div className={`apple-card p-6 ${
          monthData.netAmount >= 0 
            ? 'border-primary/20' 
            : 'border-warning/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              monthData.netAmount >= 0 ? 'bg-primary/10' : 'bg-warning/10'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                monthData.netAmount >= 0 ? 'text-primary' : 'text-warning'
              }`} />
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Net</span>
              <p className={`text-3xl font-semibold ${
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