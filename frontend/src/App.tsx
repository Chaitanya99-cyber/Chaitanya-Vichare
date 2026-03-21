import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { analyticsAPI } from "./services/api";

const queryClient = new QueryClient();

// Analytics tracking component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const trackPageView = async () => {
      try {
        await analyticsAPI.trackPageView(location.pathname, document.title);
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Enhanced Background Animations */}
      <div className="cyber-grid" />
      <div className="floating-particles" />
      <div className="code-rain" />
      <div className="pulse-ring" />
      <div className="geometric-bg" />
      
      {/* Additional floating elements */}
      <div className="fixed top-1/4 right-1/4 w-32 h-32 opacity-20 pointer-events-none z-10">
        <div className="w-full h-full border border-primary/30 rounded-full animate-[spiral-rotate_20s_linear_infinite]" />
      </div>
      <div className="fixed bottom-1/3 left-1/4 w-24 h-24 opacity-15 pointer-events-none z-10">
        <div className="w-full h-full border-2 border-accent/40 transform rotate-45 animate-[spiral-rotate_15s_linear_infinite_reverse]" />
      </div>
      
      {/* Data stream lines */}
      <div className="fixed top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-30 pointer-events-none z-10">
        <div className="w-2 h-2 bg-primary rounded-full animate-[data-stream_8s_linear_infinite]" />
      </div>
      <div className="fixed top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent opacity-25 pointer-events-none z-10">
        <div className="w-2 h-2 bg-accent rounded-full animate-[data-stream_12s_linear_infinite]" />
      </div>
      
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products" element={<Products />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
