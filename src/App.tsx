import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { JobsProvider } from "@/contexts/JobsContext";

import LoginPage from "./pages/LoginPage";
import AgentDashboard from "./pages/AgentDashboard";
import ContractorMarketplace from "./pages/ContractorMarketplace";
import JobDetailsPage from "./pages/JobDetailsPage";
import InvoicesPage from "./pages/InvoicesPage";
import MyJobsPage from "./pages/MyJobsPage";
import MyBidsPage from "./pages/MyBidsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const defaultRoute = user?.role === 'agent' ? '/dashboard' : '/marketplace';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      <Route path="/login" element={<Navigate to={defaultRoute} replace />} />
      
      {/* Agent Routes */}
      <Route path="/dashboard" element={<AgentDashboard />} />
      <Route path="/jobs" element={<MyJobsPage />} />
      
      {/* Contractor Routes */}
      <Route path="/marketplace" element={<ContractorMarketplace />} />
      <Route path="/my-bids" element={<MyBidsPage />} />
      
      {/* Shared Routes */}
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <JobsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </JobsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
