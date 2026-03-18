import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuyerOnboarding from "./pages/BuyerOnboarding";
import AdminStart from "./pages/AdminStart";
import AdminRunning from "./pages/AdminRunning";
import AdminSnapshot from "./pages/AdminSnapshot";
import AdminAnalysis from "./pages/AdminAnalysis";
import AdminFinal from "./pages/AdminFinal";
import AdminSignIn from "./pages/AdminSignIn";
import AdminCallback from "./pages/AdminCallback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminResults from "./pages/AdminResults";
import RespondentIntro from "./pages/RespondentIntro";
import SurveyQuestions from "./pages/SurveyQuestions";
import SurveyComplete from "./pages/SurveyComplete";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<BuyerOnboarding />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/sign-in" element={<AdminSignIn />} />
          <Route path="/admin/callback" element={<AdminCallback />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/order/:orderId" element={<AdminOrderDetail />} />
          <Route path="/admin/results/:surveyId" element={<AdminResults />} />
          <Route path="/admin/start" element={<AdminStart />} />
          <Route path="/admin/running" element={<AdminRunning />} />
          <Route path="/admin/snapshot/:surveyId" element={<AdminSnapshot />} />
          <Route path="/admin/analysis" element={<AdminAnalysis />} />
          <Route path="/admin/final" element={<AdminFinal />} />
          <Route path="/survey/intro" element={<RespondentIntro />} />
          <Route path="/survey/questions" element={<SurveyQuestions />} />
          <Route path="/survey/complete" element={<SurveyComplete />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
