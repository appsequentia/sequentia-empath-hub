
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import TherapistAvailabilityManager from "@/components/appointments/TherapistAvailabilityManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserCheck, DollarSign, Percent, WalletIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import TherapistProfile from "@/components/dashboard/TherapistProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const firstName = user?.user_metadata?.first_name || "Terapeuta";
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  
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

  // Mock financial data
  const financialData = {
    totalMonth: 1250.00,
    sessionValue: 150.00,
    platformFee: 15, // percentage
    liquidValue: 1062.50
  };
  
  useEffect(() => {
    const checkProfileCompleteness = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('therapist_profiles')
          .select('bio, price, avatar, title')
          .eq('id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Erro ao verificar perfil:", error);
          return;
        }
        
        // Verificar se o perfil está completo o suficiente
        const incomplete = !data || 
                          !data.bio || 
                          data.price === 0 || 
                          !data.avatar ||
                          !data.title;
        
        setIsProfileComplete(!incomplete);
        
        if (incomplete) {
          toast({
            title: "Perfil incompleto",
            description: "Complete seu perfil para melhorar sua visibilidade na plataforma.",
            duration: 6000,
          });
        }
      } catch (error) {
        console.error("Erro ao verificar perfil:", error);
      }
    };
    
    checkProfileCompleteness();
  }, [user, toast]);
  
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
          <p className="text-xl text-lavender-300 mb-8">
            Olá, {firstName}! Aqui está um resumo da sua agenda.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              {/* Alerta de perfil incompleto */}
              {!isProfileComplete && (
                <Card className="bg-amber-600/30 backdrop-blur-sm border-amber-400/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <p className="text-white">
                      Seu perfil está incompleto. Para aparecer na listagem pública, preencha todos os campos obrigatórios.
                    </p>
                  </CardContent>
                </Card>
              )}
            
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              
              {/* Financial Summary */}
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-lavender-400" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-teal-700/30 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Total no mês:</span>
                          <span className="text-lg font-semibold text-lavender-300">
                            R$ {financialData.totalMonth.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-teal-700/30 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Valor por sessão:</span>
                          <span className="text-lg font-semibold text-lavender-300">
                            R$ {financialData.sessionValue.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-teal-700/30 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Taxa de plataforma:</span>
                          <span className="text-lg font-semibold text-lavender-300">
                            {financialData.platformFee}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-teal-700/30 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Valor líquido:</span>
                          <span className="text-lg font-bold text-lavender-300">
                            R$ {financialData.liquidValue.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button className="bg-lavender-500 hover:bg-lavender-600 text-teal-900 font-medium">
                        <WalletIcon className="mr-2 h-4 w-4" />
                        Solicitar Saque
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
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
            
            <div className="space-y-8">
              <TherapistProfile />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboard;
