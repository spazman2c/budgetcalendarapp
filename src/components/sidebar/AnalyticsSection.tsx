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
    <div className="space-y-4">
      {/* Summary Cards - Reduced sizing */}
      <div className="space-y-2">
        <div className="apple-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Income</span>
            </div>
            <span className="text-sm font-bold text-success">
              {formatCurrency(currentMonthData.totalIncome)}
            </span>
          </div>
        </div>

        <div className="apple-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Expenses</span>
            </div>
            <span className="text-sm font-bold text-destructive">
              {formatCurrency(currentMonthData.totalExpense)}
            </span>
          </div>
        </div>

        <div className="apple-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Net</span>
            </div>
            <span className={`text-sm font-bold ${currentMonthData.netAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(currentMonthData.netAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown - Reduced sizing */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Category Breakdown</h3>
        <div className="space-y-1">
          {categoryBreakdown.slice(0, 6).map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 apple-card">
              <div className="flex items-center space-x-2">
                <span className="text-base">{category.icon}</span>
                <div>
                  <p className="text-xs font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-bold ${
                category.type === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {formatCurrency(category.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions - Reduced sizing */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Recent Transactions</h3>
        <div className="space-y-1">
          {state.transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)
            .map((transaction) => {
              const category = state.categories.find(c => c.id === transaction.category);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-2 apple-card">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{category?.icon || '💰'}</span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{category?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
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