
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AdminStats from "@/components/admin/AdminStats";
import PendingTherapists from "@/components/admin/PendingTherapists";
import UsersList from "@/components/admin/UsersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
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

  // Redirecionamento se o usuário não for admin
  if (!loading && userRole !== 'admin') {
    return <Navigate to="/" />;
  }

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
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-8 bg-teal-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>
          
          <div className="space-y-8">
            {/* Stats Section */}
            <section>
              <AdminStats />
            </section>
            
            {/* Pending Therapists Section */}
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
            
            {/* All Users Section */}
            <section>
              <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Lista de Usuários</CardTitle>
                  <CardDescription className="text-white/70">
                    Todos os usuários registrados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersList />
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
