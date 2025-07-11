import { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const BudgetSection = () => {
  const { state, addBudget, updateBudget, deleteBudget } = useBudget();
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    categoryId: "",
    amount: "",
    period: "monthly" as "monthly" | "yearly",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddBudget = () => {
    if (!newBudget.categoryId || !newBudget.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(newBudget.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      addBudget({
        categoryId: newBudget.categoryId,
        amount: amount,
        period: newBudget.period,
        startDate: new Date().toISOString(),
      });
      
      setNewBudget({ categoryId: "", amount: "", period: "monthly" });
      setShowAddBudget(false);
      toast.success("Budget added successfully!");
    } catch (error) {
      toast.error("Failed to add budget");
    }
  };

  // Calculate budget progress for each category
  const budgetProgress = state.budgets.map(budget => {
    const category = state.categories.find(c => c.id === budget.categoryId);
    if (!category) return null;

    const categoryTransactions = state.transactions.filter(t => 
      t.category === budget.categoryId && 
      t.type === 'expense'
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const percentage = (spent / budget.amount) * 100;

    return {
      ...budget,
      category,
      spent,
      percentage,
      remaining: budget.amount - spent,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Add Budget Button - Reduced sizing */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Budgets</h3>
        <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center space-x-1.5 text-xs px-3 py-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Budget</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-card">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Select
                  value={newBudget.categoryId}
                  onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}
                >
                  <SelectTrigger className="apple-input">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.categories
                      .filter(cat => cat.type === 'expense')
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period" className="text-sm font-medium">Period</Label>
                <Select
                  value={newBudget.period}
                  onValueChange={(value: "monthly" | "yearly") => 
                    setNewBudget({ ...newBudget, period: value })
                  }
                >
                  <SelectTrigger className="apple-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddBudget} className="apple-button w-full">
                Add Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Progress - Reduced sizing */}
      <div className="space-y-3">
        {budgetProgress.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No budgets set yet</p>
            <p className="text-xs">Add a budget to start tracking your spending</p>
          </div>
        ) : (
          budgetProgress.map((budget) => (
            <div key={budget.id} className="apple-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{budget.category.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{budget.category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {budget.period === 'monthly' ? 'Monthly' : 'Yearly'} budget
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBudget(budget.id)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg text-xs px-2 py-1"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(budget.spent)}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{formatCurrency(budget.amount)}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className={`font-medium ${
                    budget.remaining >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      budget.percentage > 100 
                        ? 'bg-destructive' 
                        : budget.percentage > 80 
                        ? 'bg-warning' 
                        : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {budget.percentage.toFixed(1)}% used
                  </span>
                  {budget.percentage > 100 && (
                    <div className="flex items-center space-x-1 text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      <span>Over budget</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 