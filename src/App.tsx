
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssessmentStart from "./pages/assessment/Start";
import AssessmentQuestion from "./pages/assessment/Question";
import AssessmentResults from "./pages/assessment/Results";
import SpecialistDetail from "./pages/Specialist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assessment/start" element={<AssessmentStart />} />
          <Route path="/assessment/questions/:questionId" element={<AssessmentQuestion />} />
          <Route path="/assessment/results" element={<AssessmentResults />} />
          <Route path="/specialists/:id" element={<SpecialistDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
