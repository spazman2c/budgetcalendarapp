import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const CalendarHeader = ({ currentDate, onDateChange }: CalendarHeaderProps) => {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1)
      : addMonths(currentDate, 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <p className="text-muted-foreground">
          Financial overview for {format(currentDate, "MMMM")}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button
          onClick={() => onDateChange(new Date())}
          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
        >
          Today
        </button>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};