
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import PendingTherapists from "@/components/admin/PendingTherapists";
import UsersList from "@/components/admin/UsersList";
import { TherapistList } from "@/components/admin/TherapistList";
import { ClientList } from "@/components/admin/ClientList";
import { DocumentList } from "@/components/admin/DocumentList";
import { SessionsList } from "@/components/admin/SessionsList";
import { FinancialSummary } from "@/components/admin/FinancialSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function AdminPanel() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  useEffect(() => {
    // Simples efeito para mostrar a página carregando
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Bem-vindo ao painel administrativo",
        description: "Todos os dados foram carregados com sucesso.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 pb-16 px-4 md:px-8 bg-teal-900">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lavender-400"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16 bg-teal-900">
        <div className="flex">
          {/* Sidebar */}
          <aside className="h-[calc(100vh-80px)] sticky top-20">
            <AdminSidebar />
          </aside>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-5xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-white/70 mt-1">Gerencie usuários, agendamentos e acesse dados da plataforma</p>
                <Separator className="mt-4 bg-lavender-400/20" />
              </div>
              
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                <TabsList className="bg-teal-800/40 border border-lavender-400/20 p-1">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="therapists" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Terapeutas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="clients" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Clientes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sessions" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Sessões
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Documentos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="financial" 
                    className="data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 text-white/70"
                  >
                    Financeiro
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-8">
                  <section>
                    <AdminStats />
                  </section>
                  
                  <section>
                    <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Terapeutas Pendentes de Aprovação</CardTitle>
                        <CardDescription className="text-white/70">
                          Revise e aprove ou rejeite os terapeutas que se cadastraram na plataforma
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PendingTherapists />
                      </CardContent>
                    </Card>
                  </section>
                </TabsContent>
                
                <TabsContent value="therapists">
                  <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Terapeutas Cadastrados</CardTitle>
                      <CardDescription className="text-white/70">
                        Lista de todos os terapeutas da plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TherapistList />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="clients">
                  <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Clientes Cadastrados</CardTitle>
                      <CardDescription className="text-white/70">
                        Lista de todos os clientes da plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ClientList />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sessions">
                  <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Sessões Agendadas</CardTitle>
                      <CardDescription className="text-white/70">
                        Lista de todas as sessões agendadas ou realizadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SessionsList />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documents">
                  <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Documentos</CardTitle>
                      <CardDescription className="text-white/70">
                        Documentos de identidade e certificações dos terapeutas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DocumentList />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="financial">
                  <FinancialSummary />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
