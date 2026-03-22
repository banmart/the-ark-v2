
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ChatProvider } from "./components/providers/ChatProvider";
import { WalletProvider } from "./components/providers/WalletProvider";
import { SwapProvider } from "./components/providers/SwapProvider";
import { OnboardingProvider } from "./components/providers/OnboardingProvider";
import { BrowserPopupProvider } from "./components/providers/BrowserPopupProvider";
import { ARKDataProvider } from "./contexts/ARKDataContext";
import ChatDrawer from "./components/chat/ChatDrawer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Locker from "./pages/Locker";
import Leaderboard from "./pages/Leaderboard";
import BurnAnalytics from "./pages/BurnAnalytics";
import Burn from "./pages/Burn";
import DAO from "./pages/DAO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <BrowserPopupProvider>
            <ARKDataProvider>
              <WalletProvider>
                <SwapProvider>
                  <OnboardingProvider>
                    <ChatProvider>
                      <Toaster />
                      <Sonner />
                      <ScrollToTop />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/locker" element={<Locker />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/burn-analytics" element={<BurnAnalytics />} />
                        <Route path="/burn" element={<Burn />} />
                        <Route path="/dao" element={<DAO />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <ChatDrawer />
                    </ChatProvider>
                  </OnboardingProvider>
                </SwapProvider>
              </WalletProvider>
            </ARKDataProvider>
          </BrowserPopupProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
