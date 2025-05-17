
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import TherapistAvailabilityManager from "@/components/appointments/TherapistAvailabilityManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserCheck } from "lucide-react";

const TherapistDashboard = () => {
  // Mock upcoming appointments data
  const upcomingAppointments = [
    {
      id: "1",
      clientName: "João Silva",
      date: "2023-05-25",
      time: "10:00"
    },
    {
      id: "2",
      clientName: "Maria Oliveira",
      date: "2023-05-25",
      time: "14:00"
    },
    {
      id: "3",
      clientName: "Pedro Santos",
      date: "2023-05-26",
      time: "09:00"
    }
  ];
  
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Painel do Terapeuta</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-lavender-400" />
                  Próximas Sessões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-lavender-300">{upcomingAppointments.length}</div>
                <p className="text-sm text-white/70">Agendadas para os próximos dias</p>
              </CardContent>
            </Card>
            
            <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-lavender-400" />
                  Total de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-lavender-300">12</div>
                <p className="text-sm text-white/70">Atendidos este mês</p>
              </CardContent>
            </Card>
            
            <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-lavender-400" />
                  Sessões Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-lavender-300">28</div>
                <p className="text-sm text-white/70">Nos últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            {/* Upcoming appointments list */}
            <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
              <CardHeader>
                <CardTitle className="text-white">Próximas Sessões</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-white/70 text-center py-4">Nenhuma sessão agendada.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex justify-between items-center p-3 bg-teal-700/40 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-white">{appointment.clientName}</p>
                          <p className="text-sm text-white/70">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}, {appointment.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-lavender-300 hover:text-lavender-200">
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Availability manager */}
            <TherapistAvailabilityManager />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboard;
