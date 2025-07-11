import { useState } from "react";
import { CategorySection } from "./CategorySection";
import { AnalyticsSection } from "./AnalyticsSection";
import { BudgetSection } from "./BudgetSection";
import { AccountSelector } from "../accounts/AccountSelector";
import { GoalsSection } from "../goals/GoalsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PiggyBank, Settings, Wallet, Target } from "lucide-react";
import { useBudget } from "@/contexts/BudgetContext";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const { state, getMonthData } = useBudget();
  
  const currentMonthData = getMonthData(new Date().getFullYear(), new Date().getMonth());

  return (
    <div className="h-full p-6 slide-up-glass">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted/30 rounded-2xl p-2 glass-card">
          <TabsTrigger 
            value="accounts" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-bold hover:scale-105"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Accounts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-bold hover:scale-105"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="budgets" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-bold hover:scale-105"
          >
            <PiggyBank className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Budgets</span>
          </TabsTrigger>
          <TabsTrigger 
            value="goals" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-bold hover:scale-105"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Goals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-500 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-bold hover:scale-105"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Categories</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="accounts" className="h-full scale-in-glass">
            <AccountSelector />
          </TabsContent>
          
          <TabsContent value="analytics" className="h-full scale-in-glass">
            <AnalyticsSection />
          </TabsContent>
          
          <TabsContent value="budgets" className="h-full scale-in-glass">
            <BudgetSection />
          </TabsContent>
          
          <TabsContent value="goals" className="h-full scale-in-glass">
            <GoalsSection />
          </TabsContent>
          
          <TabsContent value="categories" className="h-full scale-in-glass">
            <CategorySection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};