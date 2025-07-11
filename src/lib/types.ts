export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  currency: string;
  isRecurring: boolean;
  recurringId?: string;
  reminderId?: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  accountId: string;
  currency: string;
  isActive: boolean;
  lastGenerated?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  accountId?: string;
}

export interface Goal {
  id: string;
  name: string;
  type: 'savings' | 'debt' | 'purchase' | 'emergency';
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  accountId?: string;
  categoryId?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  isCompleted: boolean;
  reminderType: 'bill' | 'budget' | 'goal' | 'custom';
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Relative to USD
}

export interface DayData {
  date: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  balance: number;
}

export interface MonthData {
  year: number;
  month: number;
  days: DayData[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  startingBalance: number;
  endingBalance: number;
}

export interface Analytics {
  monthlySpending: { month: string; amount: number }[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  spendingTrends: { date: string; amount: number }[];
  budgetProgress: { category: string; spent: number; budget: number; percentage: number }[];
  cashFlowForecast: { date: string; projectedBalance: number }[];
  goalProgress: { goal: string; current: number; target: number; percentage: number }[];
}

export interface ForecastData {
  date: string;
  projectedBalance: number;
  recurringIncome: number;
  recurringExpenses: number;
  oneTimeTransactions: number;
  netProjected: number;
} 