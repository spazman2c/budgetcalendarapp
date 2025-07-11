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
    <div className="space-y-6">
      {/* Add Budget Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Budgets</h3>
        <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Budget</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.categoryId}
                  onValueChange={(value) => setNewBudget({ ...newBudget, categoryId: value })}
                >
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="period">Period</Label>
                <Select
                  value={newBudget.period}
                  onValueChange={(value: "monthly" | "yearly") => 
                    setNewBudget({ ...newBudget, period: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddBudget} className="w-full">
                Add Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Progress */}
      <div className="space-y-4">
        {budgetProgress.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No budgets set yet</p>
            <p className="text-sm">Add a budget to start tracking your spending</p>
          </div>
        ) : (
          budgetProgress.map((budget) => (
            <div key={budget.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{budget.category.icon}</span>
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
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(budget.spent)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{formatCurrency(budget.amount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className={`font-medium ${
                    budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budget.percentage > 100 
                        ? 'bg-red-500' 
                        : budget.percentage > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {budget.percentage.toFixed(1)}% used
                  </span>
                  {budget.percentage > 100 && (
                    <div className="flex items-center space-x-1 text-red-600">
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