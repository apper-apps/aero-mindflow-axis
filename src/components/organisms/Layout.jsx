import { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { useSubscription } from "@/components/providers/SubscriptionProvider";

const Layout = ({ children }) => {
const [sidebarOpen, setSidebarOpen] = useState(false);
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        subscription={subscription}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;