import { useState } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

// Mock transaction data
const mockTransactions = [
  { id: "1", date: "2025-01-02", amount: 275.00, type: "income", category: "Freelance", description: "Web project" },
  { id: "2", date: "2025-01-03", amount: -85.50, type: "expense", category: "Food", description: "Groceries" },
  { id: "3", date: "2025-01-05", amount: -320.00, type: "expense", category: "Utilities", description: "Electric bill" },
  { id: "4", date: "2025-01-08", amount: 150.00, type: "income", category: "Investments", description: "Dividend" },
  { id: "5", date: "2025-01-10", amount: -45.00, type: "expense", category: "Transportation", description: "Gas" },
  { id: "6", date: "2025-01-12", amount: -120.00, type: "expense", category: "Entertainment", description: "Movie night" },
  { id: "7", date: "2025-01-15", amount: 3000.00, type: "income", category: "Salary", description: "Monthly salary" },
  { id: "8", date: "2025-01-18", amount: -68.00, type: "expense", category: "Food", description: "Restaurant" },
  { id: "9", date: "2025-01-20", amount: -890.00, type: "expense", category: "Housing", description: "Rent" },
  { id: "10", date: "2025-01-22", amount: -35.00, type: "expense", category: "Transportation", description: "Uber" },
];

export const CalendarView = ({ currentDate, onDateChange }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTransactionsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return mockTransactions.filter(transaction => transaction.date === dateStr);
  };

  const getDayTotal = (date: Date) => {
    const transactions = getTransactionsForDate(date);
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return (
    <div className="h-full flex flex-col">
      <CalendarHeader 
        currentDate={currentDate}
        onDateChange={onDateChange}
      />
      
      <div className="flex-1 mt-6">
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