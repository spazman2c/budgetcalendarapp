import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, Account, Goal, Reminder, RecurringTransaction, ForecastData } from '@/lib/types';
import { storageManager } from '@/lib/storage';

interface BudgetState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  accounts: Account[];
  goals: Goal[];
  reminders: Reminder[];
  recurringTransactions: RecurringTransaction[];
  selectedDate: Date | null;
  selectedAccount: string | null;
  isLoading: boolean;
}

type BudgetAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_RECURRING_TRANSACTIONS'; payload: RecurringTransaction[] }
  | { type: 'ADD_RECURRING_TRANSACTION'; payload: RecurringTransaction }
  | { type: 'UPDATE_RECURRING_TRANSACTION'; payload: RecurringTransaction }
  | { type: 'DELETE_RECURRING_TRANSACTION'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null }
  | { type: 'SET_SELECTED_ACCOUNT'; payload: string | null };

const initialState: BudgetState = {
  transactions: [],
  categories: [],
  budgets: [],
  accounts: [],
  goals: [],
  reminders: [],
  recurringTransactions: [],
  selectedDate: null,
  selectedAccount: null,
  isLoading: true,
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };
    
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload),
      };
    
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      };
    
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(r => r.id !== action.payload),
      };
    
    case 'SET_RECURRING_TRANSACTIONS':
      return { ...state, recurringTransactions: action.payload };
    
    case 'ADD_RECURRING_TRANSACTION':
      return { ...state, recurringTransactions: [...state.recurringTransactions, action.payload] };
    
    case 'UPDATE_RECURRING_TRANSACTION':
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.map(rt =>
          rt.id === action.payload.id ? action.payload : rt
        ),
      };
    
    case 'DELETE_RECURRING_TRANSACTION':
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.filter(rt => rt.id !== action.payload),
      };
    
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    
    case 'SET_SELECTED_ACCOUNT':
      return { ...state, selectedAccount: action.payload };
    
    default:
      return state;
  }
}

interface BudgetContextType {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Transaction | null;
  deleteTransaction: (id: string) => boolean;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => Category | null;
  deleteCategory: (id: string) => boolean;
  addBudget: (budget: Omit<Budget, 'id'>) => Budget;
  updateBudget: (id: string, updates: Partial<Budget>) => Budget | null;
  deleteBudget: (id: string) => boolean;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => Account;
  updateAccount: (id: string, updates: Partial<Account>) => Account | null;
  deleteAccount: (id: string) => boolean;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => Goal | null;
  deleteGoal: (id: string) => boolean;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => Reminder | null;
  deleteReminder: (id: string) => boolean;
  addRecurringTransaction: (recurringTransaction: Omit<RecurringTransaction, 'id'>) => RecurringTransaction;
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => RecurringTransaction | null;
  deleteRecurringTransaction: (id: string) => boolean;
  getTransactionsForDate: (date: Date) => Transaction[];
  getDayTotal: (date: Date) => number;
  getMonthData: (year: number, month: number) => {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  };
  generateRecurringTransactions: () => void;
  getCashFlowForecast: (months: number) => ForecastData[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Initialize default data if needed
        storageManager.initializeDefaultData();
        
        // Load data from storage
        const transactions = storageManager.getTransactions();
        const categories = storageManager.getCategories();
        const budgets = storageManager.getBudgets();
        const accounts = storageManager.getAccounts();
        const goals = storageManager.getGoals();
        const reminders = storageManager.getReminders();
        const recurringTransactions = storageManager.getRecurringTransactions();
        
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        dispatch({ type: 'SET_BUDGETS', payload: budgets });
        dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
        dispatch({ type: 'SET_GOALS', payload: goals });
        dispatch({ type: 'SET_REMINDERS', payload: reminders });
        dispatch({ type: 'SET_RECURRING_TRANSACTIONS', payload: recurringTransactions });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction = storageManager.addTransaction(transaction);
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updatedTransaction = storageManager.updateTransaction(id, updates);
    if (updatedTransaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    }
    return updatedTransaction;
  };

  const deleteTransaction = (id: string) => {
    const success = storageManager.deleteTransaction(id);
    if (success) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
    return success;
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = storageManager.addCategory(category);
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategory = storageManager.updateCategory(id, updates);
    if (updatedCategory) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    }
    return updatedCategory;
  };

  const deleteCategory = (id: string) => {
    const success = storageManager.deleteCategory(id);
    if (success) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }
    return success;
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = storageManager.addBudget(budget);
    dispatch({ type: 'ADD_BUDGET', payload: newBudget });
    return newBudget;
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    const updatedBudget = storageManager.updateBudget(id, updates);
    if (updatedBudget) {
      dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
    }
    return updatedBudget;
  };

  const deleteBudget = (id: string) => {
    const success = storageManager.deleteBudget(id);
    if (success) {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
    }
    return success;
  };

  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount = storageManager.addAccount(account);
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const updatedAccount = storageManager.updateAccount(id, updates);
    if (updatedAccount) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
    }
    return updatedAccount;
  };

  const deleteAccount = (id: string) => {
    const success = storageManager.deleteAccount(id);
    if (success) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
    return success;
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal = storageManager.addGoal(goal);
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoal = storageManager.updateGoal(id, updates);
    if (updatedGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
    }
    return updatedGoal;
  };

  const deleteGoal = (id: string) => {
    const success = storageManager.deleteGoal(id);
    if (success) {
      dispatch({ type: 'DELETE_GOAL', payload: id });
    }
    return success;
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder = storageManager.addReminder(reminder);
    dispatch({ type: 'ADD_REMINDER', payload: newReminder });
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminder = storageManager.updateReminder(id, updates);
    if (updatedReminder) {
      dispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });
    }
    return updatedReminder;
  };

  const deleteReminder = (id: string) => {
    const success = storageManager.deleteReminder(id);
    if (success) {
      dispatch({ type: 'DELETE_REMINDER', payload: id });
    }
    return success;
  };

  const addRecurringTransaction = (recurringTransaction: Omit<RecurringTransaction, 'id'>) => {
    const newRecurringTransaction = storageManager.addRecurringTransaction(recurringTransaction);
    dispatch({ type: 'ADD_RECURRING_TRANSACTION', payload: newRecurringTransaction });
    return newRecurringTransaction;
  };

  const updateRecurringTransaction = (id: string, updates: Partial<RecurringTransaction>) => {
    const updatedRecurringTransaction = storageManager.updateRecurringTransaction(id, updates);
    if (updatedRecurringTransaction) {
      dispatch({ type: 'UPDATE_RECURRING_TRANSACTION', payload: updatedRecurringTransaction });
    }
    return updatedRecurringTransaction;
  };

  const deleteRecurringTransaction = (id: string) => {
    const success = storageManager.deleteRecurringTransaction(id);
    if (success) {
      dispatch({ type: 'DELETE_RECURRING_TRANSACTION', payload: id });
    }
    return success;
  };

  const getTransactionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.transactions.filter(transaction => transaction.date === dateStr);
  };

  const getDayTotal = (date: Date) => {
    const transactions = getTransactionsForDate(date);
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getMonthData = (year: number, month: number) => {
    const monthTransactions = state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netAmount = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netAmount };
  };

  const generateRecurringTransactions = () => {
    // This would generate transactions from recurring transactions
    // Implementation would go here
  };

  const getCashFlowForecast = (months: number): ForecastData[] => {
    // This would generate cash flow forecast
    // Implementation would go here
    return [];
  };

  const value: BudgetContextType = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    addAccount,
    updateAccount,
    deleteAccount,
    addGoal,
    updateGoal,
    deleteGoal,
    addReminder,
    updateReminder,
    deleteReminder,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    getTransactionsForDate,
    getDayTotal,
    getMonthData,
    generateRecurringTransactions,
    getCashFlowForecast,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
} 