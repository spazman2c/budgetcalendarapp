import { format, isToday, isSameMonth } from "date-fns";
import { useBudget } from "@/contexts/BudgetContext";
import { Transaction } from "@/lib/types";

interface CalendarGridProps {
  calendarDays: Date[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  getTransactionsForDate: (date: Date) => Transaction[];
  getDayTotal: (date: Date) => number;
}

export const CalendarGrid = ({
  calendarDays,
  currentDate,
  selectedDate,
  onDateSelect,
  getTransactionsForDate,
  getDayTotal
}: CalendarGridProps) => {
  const { state } = useBudget();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCategoryInfo = (categoryId: string) => {
    return state.categories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="glass-card p-6 h-full scale-in-glass">
      {/* Glassmorphic Week Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-sm font-bold text-muted-foreground tracking-wide">{day}</span>
          </div>
        ))}
      </div>

      {/* Glassmorphic Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 h-[calc(100%-4rem)]">
        {calendarDays.map((day) => {
          const transactions = getTransactionsForDate(day);
          const dayTotal = getDayTotal(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <div
              key={day.toISOString()}
              className={`calendar-day cursor-pointer transition-all duration-500 hover:scale-105 ${
                isDayToday ? 'today' : ''
              } ${
                isSelected ? 'ring-2 ring-primary shadow-lg' : ''
              } ${!isCurrentMonth ? 'opacity-30' : ''}`}
              onClick={() => onDateSelect(isSelected ? null : day)}
            >
              {/* Glassmorphic Day Number */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-base font-bold ${
                  isDayToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayTotal !== 0 && (
                  <span className={`text-sm font-bold ${
                    dayTotal > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    ${Math.abs(dayTotal).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Glassmorphic Transactions */}
              <div className="space-y-2">
                {transactions.slice(0, 2).map((transaction) => {
                  const categoryInfo = getCategoryInfo(transaction.category);
                  return (
                    <div
                      key={transaction.id}
                      className={`transaction-pill ${
                        transaction.type === 'income' 
                          ? 'income-pill' 
                          : 'expense-pill'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{categoryInfo?.icon || '💰'}</span>
                          <span className="truncate text-sm max-w-[60px] font-bold">
                            {categoryInfo?.name || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-sm font-bold ml-2">
                          ${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {transactions.length > 2 && (
                  <div className="text-sm text-muted-foreground text-center font-bold">
                    +{transactions.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};