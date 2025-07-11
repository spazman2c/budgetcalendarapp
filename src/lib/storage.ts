import { Transaction, Category, Budget, Account, Goal, Reminder, RecurringTransaction, Currency } from './types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_calendar_transactions',
  CATEGORIES: 'budget_calendar_categories',
  BUDGETS: 'budget_calendar_budgets',
  ACCOUNTS: 'budget_calendar_accounts',
  GOALS: 'budget_calendar_goals',
  REMINDERS: 'budget_calendar_reminders',
  RECURRING_TRANSACTIONS: 'budget_calendar_recurring_transactions',
  CURRENCIES: 'budget_calendar_currencies',
} as const;

// Default categories
const defaultCategories: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', icon: '💼', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', color: '#3b82f6' },
  { id: 'investments', name: 'Investments', type: 'income', icon: '📈', color: '#8b5cf6' },
  { id: 'housing', name: 'Housing', type: 'expense', icon: '🏠', color: '#ef4444' },
  { id: 'transportation', name: 'Transportation', type: 'expense', icon: '🚗', color: '#f59e0b' },
  { id: 'food', name: 'Food', type: 'expense', icon: '🍽️', color: '#ec4899' },
  { id: 'utilities', name: 'Utilities', type: 'expense', icon: '⚡', color: '#06b6d4' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8b5cf6' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', icon: '🏥', color: '#ef4444' },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#f59e0b' },
];

class StorageManager {
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [];
  }

  setTransactions(transactions: Transaction[]): void {
    this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    this.setTransactions(updatedTransactions);
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    const updatedTransaction: Transaction = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    transactions[index] = updatedTransaction;
    this.setTransactions(transactions);
    return updatedTransaction;
  }

  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (filteredTransactions.length === transactions.length) {
      return false;
    }
    
    this.setTransactions(filteredTransactions);
    return true;
  }

  // Categories
  getCategories(): Category[] {
    const categories = this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES);
    if (!categories || categories.length === 0) {
      this.setCategories(defaultCategories);
      return defaultCategories;
    }
    return categories;
  }

  setCategories(categories: Category[]): void {
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    
    const updatedCategories = [...categories, newCategory];
    this.setCategories(updatedCategories);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    const updatedCategory: Category = {
      ...categories[index],
      ...updates,
    };
    
    categories[index] = updatedCategory;
    this.setCategories(categories);
    return updatedCategory;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(c => c.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false;
    }
    
    this.setCategories(filteredCategories);
    return true;
  }

  // Budgets
  getBudgets(): Budget[] {
    return this.getItem<Budget[]>(STORAGE_KEYS.BUDGETS) || [];
  }

  setBudgets(budgets: Budget[]): void {
    this.setItem(STORAGE_KEYS.BUDGETS, budgets);
  }

  addBudget(budget: Omit<Budget, 'id'>): Budget {
    const budgets = this.getBudgets();
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
    };
    
    const updatedBudgets = [...budgets, newBudget];
    this.setBudgets(updatedBudgets);
    return newBudget;
  }

  updateBudget(id: string, updates: Partial<Budget>): Budget | null {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    
    if (index === -1) return null;
    
    const updatedBudget: Budget = {
      ...budgets[index],
      ...updates,
    };
    
    budgets[index] = updatedBudget;
    this.setBudgets(budgets);
    return updatedBudget;
  }

  deleteBudget(id: string): boolean {
    const budgets = this.getBudgets();
    const filteredBudgets = budgets.filter(b => b.id !== id);
    
    if (filteredBudgets.length === budgets.length) {
      return false;
    }
    
    this.setBudgets(filteredBudgets);
    return true;
  }

  // Accounts
  getAccounts(): Account[] {
    return this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
  }

  setAccounts(accounts: Account[]): void {
    this.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
  }

  addAccount(account: Omit<Account, 'id' | 'createdAt'>): Account {
    const accounts = this.getAccounts();
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedAccounts = [...accounts, newAccount];
    this.setAccounts(updatedAccounts);
    return newAccount;
  }

  updateAccount(id: string, updates: Partial<Account>): Account | null {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    const updatedAccount: Account = {
      ...accounts[index],
      ...updates,
    };
    
    accounts[index] = updatedAccount;
    this.setAccounts(accounts);
    return updatedAccount;
  }

  deleteAccount(id: string): boolean {
    const accounts = this.getAccounts();
    const filteredAccounts = accounts.filter(a => a.id !== id);
    
    if (filteredAccounts.length === accounts.length) {
      return false;
    }
    
    this.setAccounts(filteredAccounts);
    return true;
  }

  // Goals
  getGoals(): Goal[] {
    return this.getItem<Goal[]>(STORAGE_KEYS.GOALS) || [];
  }

  setGoals(goals: Goal[]): void {
    this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedGoals = [...goals, newGoal];
    this.setGoals(updatedGoals);
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === id);
    
    if (index === -1) return null;
    
    const updatedGoal: Goal = {
      ...goals[index],
      ...updates,
    };
    
    goals[index] = updatedGoal;
    this.setGoals(goals);
    return updatedGoal;
  }

  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filteredGoals = goals.filter(g => g.id !== id);
    
    if (filteredGoals.length === goals.length) {
      return false;
    }
    
    this.setGoals(filteredGoals);
    return true;
  }

  // Reminders
  getReminders(): Reminder[] {
    return this.getItem<Reminder[]>(STORAGE_KEYS.REMINDERS) || [];
  }

  setReminders(reminders: Reminder[]): void {
    this.setItem(STORAGE_KEYS.REMINDERS, reminders);
  }

  addReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Reminder {
    const reminders = this.getReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedReminders = [...reminders, newReminder];
    this.setReminders(updatedReminders);
    return newReminder;
  }

  updateReminder(id: string, updates: Partial<Reminder>): Reminder | null {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    const updatedReminder: Reminder = {
      ...reminders[index],
      ...updates,
    };
    
    reminders[index] = updatedReminder;
    this.setReminders(reminders);
    return updatedReminder;
  }

  deleteReminder(id: string): boolean {
    const reminders = this.getReminders();
    const filteredReminders = reminders.filter(r => r.id !== id);
    
    if (filteredReminders.length === reminders.length) {
      return false;
    }
    
    this.setReminders(filteredReminders);
    return true;
  }

  // Recurring Transactions
  getRecurringTransactions(): RecurringTransaction[] {
    return this.getItem<RecurringTransaction[]>(STORAGE_KEYS.RECURRING_TRANSACTIONS) || [];
  }

  setRecurringTransactions(recurringTransactions: RecurringTransaction[]): void {
    this.setItem(STORAGE_KEYS.RECURRING_TRANSACTIONS, recurringTransactions);
  }

  addRecurringTransaction(recurringTransaction: Omit<RecurringTransaction, 'id'>): RecurringTransaction {
    const recurringTransactions = this.getRecurringTransactions();
    const newRecurringTransaction: RecurringTransaction = {
      ...recurringTransaction,
      id: crypto.randomUUID(),
    };
    
    const updatedRecurringTransactions = [...recurringTransactions, newRecurringTransaction];
    this.setRecurringTransactions(updatedRecurringTransactions);
    return newRecurringTransaction;
  }

  updateRecurringTransaction(id: string, updates: Partial<RecurringTransaction>): RecurringTransaction | null {
    const recurringTransactions = this.getRecurringTransactions();
    const index = recurringTransactions.findIndex(rt => rt.id === id);
    
    if (index === -1) return null;
    
    const updatedRecurringTransaction: RecurringTransaction = {
      ...recurringTransactions[index],
      ...updates,
    };
    
    recurringTransactions[index] = updatedRecurringTransaction;
    this.setRecurringTransactions(recurringTransactions);
    return updatedRecurringTransaction;
  }

  deleteRecurringTransaction(id: string): boolean {
    const recurringTransactions = this.getRecurringTransactions();
    const filteredRecurringTransactions = recurringTransactions.filter(rt => rt.id !== id);
    
    if (filteredRecurringTransactions.length === recurringTransactions.length) {
      return false;
    }
    
    this.setRecurringTransactions(filteredRecurringTransactions);
    return true;
  }

  // Initialize default data
  initializeDefaultData(): void {
    const transactions = this.getTransactions();
    const categories = this.getCategories();
    const accounts = this.getAccounts();
    
    if (transactions.length === 0) {
      // Add some sample transactions
      const sampleTransactions = [
        {
          amount: 5000,
          type: 'income' as const,
          category: 'salary',
          description: 'Monthly salary',
          date: new Date().toISOString().split('T')[0],
          accountId: 'checking-1',
          currency: 'USD',
          isRecurring: false,
        },
        {
          amount: -1200,
          type: 'expense' as const,
          category: 'housing',
          description: 'Rent payment',
          date: new Date().toISOString().split('T')[0],
          accountId: 'checking-1',
          currency: 'USD',
          isRecurring: false,
        },
        {
          amount: -300,
          type: 'expense' as const,
          category: 'food',
          description: 'Groceries',
          date: new Date().toISOString().split('T')[0],
          accountId: 'checking-1',
          currency: 'USD',
          isRecurring: false,
        },
      ];
      
      sampleTransactions.forEach(transaction => {
        this.addTransaction(transaction);
      });
    }
    
    if (categories.length === 0) {
      this.setCategories(defaultCategories);
    }

    if (accounts.length === 0) {
      // Add default accounts
      const defaultAccounts: Account[] = [
        {
          id: 'checking-1',
          name: 'Main Checking',
          type: 'checking',
          balance: 5000,
          currency: 'USD',
          color: '#3b82f6',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'savings-1',
          name: 'Savings Account',
          type: 'savings',
          balance: 15000,
          currency: 'USD',
          color: '#10b981',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      this.setAccounts(defaultAccounts);
    }
  }
}

export const storageManager = new StorageManager(); 