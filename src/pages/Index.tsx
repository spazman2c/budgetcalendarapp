import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { Header } from "@/components/layout/Header";
import { useBudget } from "@/contexts/BudgetContext";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { state } = useBudget();

  return (
    <div className="min-h-screen animated-bg particle-bg fade-in-glass">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Glassmorphic Sidebar */}
        <div className="w-80 glass-sidebar float">
          <Sidebar />
        </div>

        {/* Glassmorphic Calendar */}
        <div className="flex-1 p-8 slide-up-glass">
          <CalendarView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        {/* Glassmorphic Transaction Form */}
        {showTransactionForm && (
          <div className="w-80 border-l border-border/40 glass-card scale-in-glass">
            <TransactionForm 
              onClose={() => setShowTransactionForm(false)}
              selectedDate={state.selectedDate}
            />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="floating-fab neon-glow"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Index;
