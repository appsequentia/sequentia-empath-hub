
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Therapies from '@/pages/Therapies';
import Specialists from '@/pages/Specialists';
import Specialist from '@/pages/Specialist';
import LoginTerapeuta from '@/pages/auth/LoginTerapeuta';
import LoginCliente from '@/pages/auth/LoginCliente';
import RegisterTerapeuta from '@/pages/auth/RegisterTerapeuta';
import RegisterCliente from '@/pages/auth/RegisterCliente';
import AdminPanel from '@/pages/admin/AdminPanel';
import StartAssessment from '@/pages/assessment/Start';
import Question from '@/pages/assessment/Question';
import Results from '@/pages/assessment/Results';
import ClientDashboard from '@/pages/dashboard/ClientDashboard';
import TherapistDashboard from '@/pages/dashboard/TherapistDashboard';
import NotFound from '@/pages/NotFound';
import Pagamento from '@/pages/Pagamento';
import { createTherapistDocumentsBucket } from '@/integrations/supabase/createBucket';

function App() {
  // Initialize therapy documents bucket on app load
  useEffect(() => {
    createTherapistDocumentsBucket();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/terapias" element={<Therapies />} />
          <Route path="/especialistas" element={<Specialists />} />
          <Route path="/especialistas/:id" element={<Specialist />} />
          <Route path="/login-terapeuta" element={<LoginTerapeuta />} />
          <Route path="/login-cliente" element={<LoginCliente />} />
          <Route path="/register-terapeuta" element={<RegisterTerapeuta />} />
          <Route path="/register-cliente" element={<RegisterCliente />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard/terapeuta" element={<TherapistDashboard />} />
          <Route path="/dashboard/cliente" element={<ClientDashboard />} />
          <Route path="/avaliacao" element={<StartAssessment />} />
          <Route path="/avaliacao/pergunta/:id" element={<Question />} />
          <Route path="/avaliacao/resultados" element={<Results />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
