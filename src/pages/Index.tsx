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
    <div className="min-h-screen bg-background fade-in">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Apple-style Sidebar */}
        <div className="w-80 apple-sidebar">
          <Sidebar />
        </div>

        {/* Apple-style Calendar */}
        <div className="flex-1 p-8 slide-up">
          <CalendarView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        {/* Apple-style Transaction Form */}
        {showTransactionForm && (
          <div className="w-80 border-l border-border bg-card/80 backdrop-blur-xl scale-in">
            <TransactionForm 
              onClose={() => setShowTransactionForm(false)}
              selectedDate={state.selectedDate}
            />
          </div>
        )}
      </div>

      {/* Apple-style Floating Add Button */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="apple-fab"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Index;
