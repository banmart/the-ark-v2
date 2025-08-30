
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./components/providers/ChatProvider";
import { WalletProvider } from "./components/providers/WalletProvider";
import { SwapProvider } from "./components/providers/SwapProvider";
import { OnboardingProvider } from "./components/providers/OnboardingProvider";
import { BrowserPopupProvider } from "./components/providers/BrowserPopupProvider";
import ChatDrawer from "./components/chat/ChatDrawer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Locker from "./pages/Locker";
import Leaderboard from "./pages/Leaderboard";
import BurnAnalytics from "./pages/BurnAnalytics";
import Burn from "./pages/Burn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserPopupProvider>
        <WalletProvider>
          <SwapProvider>
            <OnboardingProvider>
              <ChatProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/locker" element={<Locker />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/burn-analytics" element={<BurnAnalytics />} />
                    <Route path="/burn" element={<Burn />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <ChatDrawer />
                </BrowserRouter>
              </ChatProvider>
            </OnboardingProvider>
          </SwapProvider>
        </WalletProvider>
      </BrowserPopupProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
