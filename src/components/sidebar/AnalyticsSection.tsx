import { useBudget } from "@/contexts/BudgetContext";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format } from "date-fns";

export const AnalyticsSection = () => {
  const { state, getMonthData } = useBudget();
  const currentMonthData = getMonthData(new Date().getFullYear(), new Date().getMonth());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate category breakdown
  const categoryBreakdown = state.categories.map(category => {
    const categoryTransactions = state.transactions.filter(t => t.category === category.id);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      total: Math.abs(total),
      transactionCount: categoryTransactions.length,
    };
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="space-y-3">
        <div className="bg-card border border-border rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Income</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(currentMonthData.totalIncome)}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Expenses</span>
            </div>
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(currentMonthData.totalExpense)}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Net</span>
            </div>
            <span className={`text-lg font-bold ${currentMonthData.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentMonthData.netAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Category Breakdown</h3>
        <div className="space-y-2">
          {categoryBreakdown.slice(0, 8).map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold ${
                category.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(category.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {state.transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((transaction) => {
              const category = state.categories.find(c => c.id === transaction.category);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category?.icon || '💰'}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{category?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}; 