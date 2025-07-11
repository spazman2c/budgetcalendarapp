import { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, CreditCard, ShoppingBag, Shield } from "lucide-react";
import { toast } from "sonner";

const goalTypeIcons = {
  savings: TrendingUp,
  debt: CreditCard,
  purchase: ShoppingBag,
  emergency: Shield,
};

const goalTypeColors = {
  savings: "#10b981",
  debt: "#ef4444",
  purchase: "#f59e0b",
  emergency: "#8b5cf6",
};

export const GoalsSection = () => {
  const { state, addGoal, updateGoal, deleteGoal } = useBudget();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    type: "savings" as const,
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    currency: "USD",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddGoal = () => {
    if (!newGoal.name.trim()) {
      toast.error("Please enter a goal name");
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    const currentAmount = parseFloat(newGoal.currentAmount);
    
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    if (isNaN(currentAmount) || currentAmount < 0) {
      toast.error("Please enter a valid current amount");
      return;
    }

    try {
      addGoal({
        name: newGoal.name,
        type: newGoal.type,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        targetDate: newGoal.targetDate,
        currency: newGoal.currency,
        isActive: true,
      });
      
      setNewGoal({ name: "", type: "savings", targetAmount: "", currentAmount: "", targetDate: "", currency: "USD" });
      setShowAddGoal(false);
      toast.success("Goal added successfully!");
    } catch (error) {
      toast.error("Failed to add goal");
    }
  };

  const handleUpdateProgress = (goalId: string, newAmount: number) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    updateGoal(goalId, { currentAmount: newAmount });
    toast.success("Progress updated!");
  };

  const getGoalProgress = (goal: any) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal: any) => {
    const progress = getGoalProgress(goal);
    const daysLeft = getDaysUntilTarget(goal.targetDate);
    
    if (progress >= 100) return "Completed";
    if (daysLeft < 0) return "Overdue";
    if (daysLeft <= 30) return "Due Soon";
    return "On Track";
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'status-success';
      case 'Overdue':
        return 'status-destructive';
      case 'Due Soon':
        return 'status-warning';
      default:
        return 'status-primary';
    }
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Apple-style Add Goal Button - Reduced sizing */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Financial Goals</h3>
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogTrigger asChild>
            <Button className="apple-button-secondary flex items-center space-x-1.5 text-xs px-3 py-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-card">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Goal Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value: any) => setNewGoal({ ...newGoal, type: value })}
                >
                  <SelectTrigger className="apple-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="debt">Debt Repayment</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-sm font-medium">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="apple-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAmount" className="text-sm font-medium">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-sm font-medium">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="apple-input"
                />
              </div>

              <Button onClick={handleAddGoal} className="apple-button w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Apple-style Goals List - Reduced sizing */}
      <div className="space-y-3">
        {state.goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-base font-medium">No goals set yet</p>
            <p className="text-xs">Add a goal to start tracking your progress</p>
          </div>
        ) : (
          state.goals.map((goal) => {
            const Icon = goalTypeIcons[goal.type];
            const progress = getGoalProgress(goal);
            const status = getGoalStatus(goal);
            const daysLeft = getDaysUntilTarget(goal.targetDate);
            
            return (
              <div key={goal.id} className="apple-card p-4 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goalTypeColors[goal.type]}20` }}>
                      <Icon className="w-5 h-5" style={{ color: goalTypeColors[goal.type] }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{goal.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{goal.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge ${getStatusClass(status)}`}>
                      {status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg text-xs px-2 py-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-2 rounded-full" />
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-semibold ml-1">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-semibold ml-1">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </span>
                  </div>

                  {daysLeft > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {daysLeft} days until target date
                    </div>
                  )}

                  {/* Apple-style Quick Update Progress - Reduced sizing */}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Update amount"
                      className="apple-input flex-1 text-xs"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newAmount = parseFloat(e.currentTarget.value);
                          if (!isNaN(newAmount) && newAmount >= 0) {
                            handleUpdateProgress(goal.id, newAmount);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      className="apple-button-secondary text-xs px-3 py-2"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const newAmount = parseFloat(input.value);
                        if (!isNaN(newAmount) && newAmount >= 0) {
                          handleUpdateProgress(goal.id, newAmount);
                          input.value = '';
                        }
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}; 