import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card">
          <Sidebar />
        </div>

        {/* Calendar */}
        <div className="flex-1 p-6">
          <CalendarView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        {/* Transaction Form */}
        {showTransactionForm && (
          <div className="w-80 border-l border-border bg-card">
            <TransactionForm onClose={() => setShowTransactionForm(false)} />
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Index;
