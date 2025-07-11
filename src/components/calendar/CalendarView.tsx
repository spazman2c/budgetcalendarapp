import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { useBudget } from "@/contexts/BudgetContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const CalendarView = ({ currentDate, onDateChange }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { getTransactionsForDate, getDayTotal, getMonthData } = useBudget();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthData = getMonthData(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="h-full flex flex-col fade-in-glass">
      <CalendarHeader 
        currentDate={currentDate}
        onDateChange={onDateChange}
        monthData={monthData}
      />
      
      <div className="flex-1 mt-8 slide-up-glass">
        <CalendarGrid
          calendarDays={calendarDays}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          getTransactionsForDate={getTransactionsForDate}
          getDayTotal={getDayTotal}
        />
      </div>
    </div>
  );
};