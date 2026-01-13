import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Assessment from "./pages/Assessment";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
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
          {/* Default Route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          {/* Protected Mother Routes */}
          <Route element={<ProtectedRoute allowedRoles={['mother']} />}>
            <Route path="/mother/home" element={<Index />} />
            <Route path="/assess" element={<Assessment />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Protected Health Worker Routes */}
          <Route element={<ProtectedRoute allowedRoles={['health_worker']} />}>
            <Route path="/worker/dashboard" element={<Dashboard />} />
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Top Nav - Hidden on Login/Root */}
      {!shouldHideNav && (
        <div className="md:hidden">
          <TopNav />
        </div>
      )}

      {/* Desktop Side Nav - Hidden on Login/Root */}
      {!shouldHideNav && <SideNav />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!shouldHideNav ? 'md:pl-20' : ''}`}>
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
