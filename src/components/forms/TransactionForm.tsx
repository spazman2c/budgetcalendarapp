import { useState } from "react";
import { X, Calendar, DollarSign, Tag, FileText, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBudget } from "@/contexts/BudgetContext";
import { toast } from "sonner";

interface TransactionFormProps {
  onClose: () => void;
  selectedDate?: Date;
}

export const TransactionForm = ({ onClose, selectedDate }: TransactionFormProps) => {
  const { addTransaction, state } = useBudget();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    accountId: state.accounts.length > 0 ? state.accounts[0].id : "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const selectedCategory = state.categories.find(cat => cat.id === formData.category);
    if (!selectedCategory) {
      toast.error("Please select a valid category");
      return;
    }

    const transactionData = {
      amount: selectedCategory.type === 'income' ? amount : -amount,
      type: selectedCategory.type,
      category: selectedCategory.id,
      description: formData.description,
      date: formData.date,
      accountId: formData.accountId,
      currency: "USD",
      isRecurring: false,
    };

    try {
      addTransaction(transactionData);
      toast.success("Transaction added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const selectedCategory = state.categories.find(cat => cat.id === formData.category);
  const isIncome = selectedCategory?.type === "income";

  return (
    <div className="h-full p-8 scale-in">
      {/* Apple-style Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-semibold text-foreground tracking-tight">New Transaction</h3>
          <p className="text-muted-foreground">Add income or expense</p>
        </div>
        <button
          onClick={onClose}
          className="p-3 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:scale-105"
        >
          <X className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Apple-style Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div className="space-y-3">
          <Label htmlFor="amount" className="flex items-center space-x-3 text-base font-medium">
            <DollarSign className="w-5 h-5" />
            <span>Amount</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="apple-input text-xl font-semibold"
            required
          />
        </div>

        {/* Account */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-3 text-base font-medium">
            <Wallet className="w-5 h-5" />
            <span>Account</span>
          </Label>
          <Select
            value={formData.accountId}
            onValueChange={(value) => setFormData({ ...formData, accountId: value })}
          >
            <SelectTrigger className="apple-input">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {state.accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-muted-foreground">
                      ${account.balance.toLocaleString()}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-3 text-base font-medium">
            <Tag className="w-5 h-5" />
            <span>Category</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="apple-input">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-4">
                <div className="text-sm font-semibold text-muted-foreground mb-3">Income</div>
                {state.categories.filter(cat => cat.type === "income").map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-muted-foreground mb-3">Expenses</div>
                {state.categories.filter(cat => cat.type === "expense").map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-3">
          <Label htmlFor="date" className="flex items-center space-x-3 text-base font-medium">
            <Calendar className="w-5 h-5" />
            <span>Date</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="apple-input"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label htmlFor="description" className="flex items-center space-x-3 text-base font-medium">
            <FileText className="w-5 h-5" />
            <span>Description</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Optional description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="apple-input resize-none"
          />
        </div>

        {/* Apple-style Submit Button */}
        <Button
          type="submit"
          className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isIncome 
              ? 'bg-success hover:bg-success/90 text-success-foreground shadow-lg' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
          }`}
        >
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>
    </div>
  );
};