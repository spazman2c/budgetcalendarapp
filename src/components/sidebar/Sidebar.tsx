import { useState } from "react";
import { CategorySection } from "./CategorySection";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const mockIncomeCategories = [
  { id: "1", name: "Salary", amount: 8339.69, color: "income" },
  { id: "2", name: "Freelance", amount: 1200.00, color: "income" },
  { id: "3", name: "Investments", amount: 450.00, color: "income" },
];

const mockExpenseCategories = [
  { id: "4", name: "Housing", amount: -2814.62, color: "expense-primary" },
  { id: "5", name: "Transportation", amount: -450.00, color: "expense-secondary" },
  { id: "6", name: "Food", amount: -680.00, color: "expense-tertiary" },
  { id: "7", name: "Utilities", amount: -320.00, color: "expense-quaternary" },
  { id: "8", name: "Entertainment", amount: -240.00, color: "expense-primary" },
];

export const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const totalIncome = mockIncomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpenses = mockExpenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const netAmount = totalIncome + totalExpenses;

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Summary Cards */}
      <div className="space-y-3 mb-6">
        <div className="budget-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-income" />
              <span className="text-sm font-medium text-muted-foreground">Income</span>
            </div>
            <span className="text-lg font-bold text-income">
              ${totalIncome.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="budget-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-expense-primary" />
              <span className="text-sm font-medium text-muted-foreground">Expenses</span>
            </div>
            <span className="text-lg font-bold text-expense-primary">
              ${Math.abs(totalExpenses).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="budget-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Net</span>
            </div>
            <span className={`text-lg font-bold ${netAmount >= 0 ? 'text-income' : 'text-expense-primary'}`}>
              ${Math.abs(netAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Income Categories */}
      <CategorySection
        title="Income"
        categories={mockIncomeCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Expense Categories */}
      <CategorySection
        title="Expenses"
        categories={mockExpenseCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </div>
  );
};