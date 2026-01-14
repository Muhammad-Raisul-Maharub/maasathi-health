import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Assessment from "./pages/Assessment";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import HealthWorkerHome from "./pages/HealthWorkerHome";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./context/LanguageContext";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import HistoryPage from "./pages/History";
import Help from "./pages/Help";
import BottomNav from "./components/BottomNav";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="flex-1 flex"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Routes location={location}>
          {/* Default Route: Smart Redirect */}
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Shared Protected Routes (Mother & Health Worker) */}
          <Route element={<ProtectedRoute allowedRoles={['mother', 'health_worker']} />}>
            <Route path="/assess" element={<Assessment />} />
            <Route path="/result" element={<Result />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Mother Exclusive Routes */}
          <Route element={<ProtectedRoute allowedRoles={['mother']} />}>
            <Route path="/mother/home" element={<Index />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Health Worker Exclusive Routes */}
          <Route element={<ProtectedRoute allowedRoles={['health_worker']} />}>
            <Route path="/worker/dashboard" element={<HealthWorkerHome />} />
            <Route path="/worker/analytics" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const location = useLocation();
  // Hide Navigation on Login AND Root (while redirecting)
  const shouldHideNav = location.pathname === "/login" || location.pathname === "/";
  // Default to collapsed (false) to match previous "rail" style initially, or true if user prefers expanded 
  // But user complained about "zoom", so maybe expanded is better? Let's start expanded for better visibility, 
  // or stick to refined collapsed and let them toggle. Let's try defaulting to FALSE (collapsed) but give them the toggle.
  // Actually, to fix "zoom" issues, larger text is better. Let's default to TRUE (Expanded) for desktop.
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background transition-all duration-300">
      {/* Mobile Top Nav - Hidden on Login/Root */}
      {!shouldHideNav && (
        <div className="md:hidden">
          <TopNav />
        </div>
      )}

      {/* Desktop Side Nav - Hidden on Login/Root */}
      {!shouldHideNav && (
        <SideNav
          isExpanded={isSidebarExpanded}
          toggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${!shouldHideNav ? (isSidebarExpanded ? 'md:pl-64' : 'md:pl-20') : ''
          }`}
      >
        <AppRoutes />
      </div>

      {/* Mobile Bottom Nav - Hidden on Login/Root */}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AppLayout />
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
