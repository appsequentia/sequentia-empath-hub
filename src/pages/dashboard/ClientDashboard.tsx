
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ClientAppointmentsList from "@/components/appointments/ClientAppointmentsList";
import ClientProfile from "@/components/dashboard/ClientProfile";
import ClientInfoAccordion from "@/components/dashboard/ClientInfoAccordion";

const ClientDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || "Cliente";
  
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
          <p className="text-xl text-lavender-300 mb-8">
            Olá, {firstName}! Aqui estão suas próximas sessões.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <ClientAppointmentsList />
            </div>
            
            <div className="space-y-8">
              <ClientProfile />
              <ClientInfoAccordion />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
