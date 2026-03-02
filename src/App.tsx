import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CinematicLoader } from '@/components/CinematicLoader';
import Index from "./pages/Index";
import DataSourcesPage from "./pages/DataSourcesPage";
import DashboardsPage from "./pages/DashboardsPage";
import DashboardBuilderPage from "./pages/DashboardBuilderPage";
import DashboardOutputPage from "./pages/DashboardOutputPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import TemplatesPage from "./pages/TemplatesPage";
import AuthPage from "./pages/AuthPage";
import WorkspacePage from "./pages/WorkspacePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    const lastShown = sessionStorage.getItem('visorybi-loader-shown');
    return !lastShown;
  });

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
    sessionStorage.setItem('visorybi-loader-shown', 'true');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showLoader && <CinematicLoader onComplete={handleLoaderComplete} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/data" element={<DataSourcesPage />} />
            <Route path="/dashboards" element={<DashboardsPage />} />
            <Route path="/builder" element={<DashboardBuilderPage />} />
            <Route path="/view/:id" element={<DashboardOutputPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
