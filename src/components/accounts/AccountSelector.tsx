import { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Wallet, CreditCard, PiggyBank, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  cash: DollarSign,
};

const accountTypeColors = {
  checking: "#3b82f6",
  savings: "#10b981",
  credit: "#f59e0b",
  investment: "#8b5cf6",
  cash: "#6b7280",
};

export const AccountSelector = () => {
  const { state, addAccount, updateAccount, deleteAccount } = useBudget();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "checking" as const,
    balance: "",
    currency: "USD",
    color: "#3b82f6",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddAccount = () => {
    if (!newAccount.name.trim()) {
      toast.error("Please enter an account name");
      return;
    }

    const balance = parseFloat(newAccount.balance);
    if (isNaN(balance)) {
      toast.error("Please enter a valid balance");
      return;
    }

    try {
      addAccount({
        name: newAccount.name,
        type: newAccount.type,
        balance: balance,
        currency: newAccount.currency,
        color: newAccount.color,
        isActive: true,
      });
      
      setNewAccount({ name: "", type: "checking", balance: "", currency: "USD", color: "#3b82f6" });
      setShowAddAccount(false);
      toast.success("Account added successfully!");
    } catch (error) {
      toast.error("Failed to add account");
    }
  };

  const handleAccountChange = (accountId: string) => {
    // This would update the selected account in the context
    // For now, we'll just log it
    console.log("Selected account:", accountId);
  };

  const getTotalBalance = () => {
    return state.accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Apple-style Account Selector - Reduced sizing */}
      <div className="flex items-center space-x-2">
        <Select value={state.selectedAccount || ""} onValueChange={handleAccountChange}>
          <SelectTrigger className="apple-input w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {state.accounts.map((account) => {
              const Icon = accountTypeIcons[account.type];
              return (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" style={{ color: account.color }} />
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatCurrency(account.balance)}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
          <DialogTrigger asChild>
            <Button className="apple-button-secondary p-2.5">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-card">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Account Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Checking"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value: any) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger className="apple-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance" className="text-sm font-medium">Current Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                  className="apple-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                <Select
                  value={newAccount.currency}
                  onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}
                >
                  <SelectTrigger className="apple-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddAccount} className="apple-button w-full">
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Apple-style Account Summary - Reduced sizing */}
      {state.accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="apple-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Total Balance</span>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(getTotalBalance())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="apple-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-info/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-info" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Active Accounts</span>
                  <p className="text-lg font-semibold text-foreground">
                    {state.accounts.filter(a => a.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apple-style Account List - Reduced sizing */}
      <div className="space-y-2">
        {state.accounts.map((account) => {
          const Icon = accountTypeIcons[account.type];
          return (
            <div
              key={account.id}
              className="apple-card p-3 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${account.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: account.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{account.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(account.balance)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAccount(account.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg text-xs px-2 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 