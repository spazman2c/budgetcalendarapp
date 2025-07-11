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
    <div className="h-full p-6 slide-up">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted/50 rounded-2xl p-1">
          <TabsTrigger 
            value="accounts" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Accounts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="budgets" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <PiggyBank className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Budgets</span>
          </TabsTrigger>
          <TabsTrigger 
            value="goals" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Goals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="categories" 
            className="flex items-center space-x-2 rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Categories</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="accounts" className="h-full scale-in">
            <AccountSelector />
          </TabsContent>
          
          <TabsContent value="analytics" className="h-full scale-in">
            <AnalyticsSection />
          </TabsContent>
          
          <TabsContent value="budgets" className="h-full scale-in">
            <BudgetSection />
          </TabsContent>
          
          <TabsContent value="goals" className="h-full scale-in">
            <GoalsSection />
          </TabsContent>
          
          <TabsContent value="categories" className="h-full scale-in">
            <CategorySection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};