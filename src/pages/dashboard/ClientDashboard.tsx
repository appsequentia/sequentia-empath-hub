
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ClientAppointmentsList from "@/components/appointments/ClientAppointmentsList";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Meu Painel</h1>
          
          <div className="space-y-8">
            <ClientAppointmentsList />
            
            {/* Here you could add more components like recommended therapists, etc. */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
