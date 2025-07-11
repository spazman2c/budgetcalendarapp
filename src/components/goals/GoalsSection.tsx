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

  return (
    <div className="space-y-6 fade-in">
      {/* Apple-style Add Goal Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">Financial Goals</h3>
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogTrigger asChild>
            <Button className="apple-button-secondary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-medium">Goal Type</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="targetAmount" className="text-base font-medium">Target Amount</Label>
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

                <div className="space-y-3">
                  <Label htmlFor="currentAmount" className="text-base font-medium">Current Amount</Label>
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

              <div className="space-y-3">
                <Label htmlFor="targetDate" className="text-base font-medium">Target Date</Label>
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

      {/* Apple-style Goals List */}
      <div className="space-y-4">
        {state.goals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <p className="text-lg font-medium">No goals set yet</p>
            <p className="text-sm">Add a goal to start tracking your progress</p>
          </div>
        ) : (
          state.goals.map((goal) => {
            const Icon = goalTypeIcons[goal.type];
            const progress = getGoalProgress(goal);
            const status = getGoalStatus(goal);
            const daysLeft = getDaysUntilTarget(goal.targetDate);
            
            return (
              <div key={goal.id} className="apple-card p-6 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${goalTypeColors[goal.type]}20` }}>
                      <Icon className="w-6 h-6" style={{ color: goalTypeColors[goal.type] }} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{goal.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{goal.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      status === 'Completed' ? 'bg-success/10 text-success' :
                      status === 'Overdue' ? 'bg-destructive/10 text-destructive' :
                      status === 'Due Soon' ? 'bg-warning/10 text-warning' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-2xl"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-3 rounded-full" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-semibold ml-2">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-semibold ml-2">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-semibold">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </span>
                  </div>

                  {daysLeft > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {daysLeft} days until target date
                    </div>
                  )}

                  {/* Apple-style Quick Update Progress */}
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Update amount"
                      className="apple-input flex-1"
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
                      className="apple-button-secondary"
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