import { ChevronDown, ChevronRight, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const CategorySection = () => {
  const { state, addCategory, deleteCategory } = useBudget();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    icon: "💰",
    color: "#6b7280",
  });

  const toggleCategoryVisibility = (categoryId: string) => {
    const newHidden = new Set(hiddenCategories);
    if (newHidden.has(categoryId)) {
      newHidden.delete(categoryId);
    } else {
      newHidden.add(categoryId);
    }
    setHiddenCategories(newHidden);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      addCategory(newCategory);
      setNewCategory({ name: "", type: "expense", icon: "💰", color: "#6b7280" });
      setShowAddCategory(false);
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (state.transactions.some(t => t.category === categoryId)) {
      toast.error("Cannot delete category with existing transactions");
      return;
    }

    try {
      deleteCategory(categoryId);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // Calculate category totals
  const categoryTotals = state.categories.map(category => {
    const categoryTransactions = state.transactions.filter(t => t.category === category.id);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      total: Math.abs(total),
      transactionCount: categoryTransactions.length,
    };
  });

  const incomeCategories = categoryTotals.filter(cat => cat.type === 'income');
  const expenseCategories = categoryTotals.filter(cat => cat.type === 'expense');

  return (
    <div className="space-y-6 fade-in-glass">
      {/* Glassmorphic Add Category Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-foreground tracking-tight">Categories</h3>
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogTrigger asChild>
            <Button className="neon-button-secondary flex items-center space-x-2 text-sm px-4 py-2">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-bold">Name</Label>
                <Input
                  id="name"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="futuristic-input"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-base font-bold">Type</Label>
                <Select
                  value={newCategory.type}
                  onValueChange={(value: "income" | "expense") => 
                    setNewCategory({ ...newCategory, type: value })
                  }
                >
                  <SelectTrigger className="futuristic-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="icon" className="text-base font-bold">Icon</Label>
                <Input
                  id="icon"
                  placeholder="💰"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="futuristic-input"
                />
              </div>

              <Button onClick={handleAddCategory} className="neon-button w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Glassmorphic Income Categories */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-muted-foreground">Income Categories</h4>
        <div className="space-y-3">
          {incomeCategories.map((category) => (
            <div
              key={category.id}
              className="glass-card p-4 transition-all duration-500 hover:scale-105 float"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-success/30 rounded-2xl flex items-center justify-center neon-glow">
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-base font-bold text-success">
                    ${category.total.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/20 rounded-xl text-sm px-3 py-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphic Expense Categories */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-muted-foreground">Expense Categories</h4>
        <div className="space-y-3">
          {expenseCategories.map((category) => (
            <div
              key={category.id}
              className="glass-card p-4 transition-all duration-500 hover:scale-105 float-delayed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-destructive/30 rounded-2xl flex items-center justify-center neon-glow">
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-base font-bold text-destructive">
                    ${category.total.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/20 rounded-xl text-sm px-3 py-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};