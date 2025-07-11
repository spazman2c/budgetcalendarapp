import { format, isToday, isSameMonth } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  description: string;
}

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
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="budget-card p-4 h-full">
      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-sm font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 h-[calc(100%-3rem)]">
        {calendarDays.map((day) => {
          const transactions = getTransactionsForDate(day);
          const dayTotal = getDayTotal(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <div
              key={day.toISOString()}
              className={`calendar-day ${isDayToday ? 'today' : ''} ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${!isCurrentMonth ? 'opacity-30' : ''}`}
              onClick={() => onDateSelect(isSelected ? null : day)}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isDayToday ? 'text-primary font-bold' : 'text-foreground'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayTotal !== 0 && (
                  <span className={`text-xs font-bold ${
                    dayTotal > 0 ? 'text-income' : 'text-expense-primary'
                  }`}>
                    ${Math.abs(dayTotal).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Transactions */}
              <div className="space-y-1">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`transaction-pill ${
                      transaction.type === 'income' ? 'income-pill' : 'expense-pill'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[10px]">
                        {transaction.category}
                      </span>
                      <span className="text-[10px] font-bold ml-1">
                        ${Math.abs(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {transactions.length > 3 && (
                  <div className="text-[10px] text-muted-foreground text-center">
                    +{transactions.length - 3} more
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