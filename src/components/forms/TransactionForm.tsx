import { useState } from "react";
import { X, Calendar, DollarSign, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TransactionFormProps {
  onClose: () => void;
}

const categories = [
  { value: "salary", label: "Salary", type: "income" },
  { value: "freelance", label: "Freelance", type: "income" },
  { value: "investments", label: "Investments", type: "income" },
  { value: "housing", label: "Housing", type: "expense" },
  { value: "transportation", label: "Transportation", type: "expense" },
  { value: "food", label: "Food", type: "expense" },
  { value: "utilities", label: "Utilities", type: "expense" },
  { value: "entertainment", label: "Entertainment", type: "expense" },
];

export const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Transaction:", formData);
    onClose();
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const isIncome = selectedCategory?.type === "income";

  return (
    <div className="h-full p-6 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">New Transaction</h3>
          <p className="text-sm text-muted-foreground">Add income or expense</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Amount</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="text-lg font-medium"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Income</div>
                {categories.filter(cat => cat.type === "income").map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </div>
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Expenses</div>
                {categories.filter(cat => cat.type === "expense").map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Description</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Optional description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full h-12 text-base font-medium ${
            isIncome 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>
    </div>
  );
};