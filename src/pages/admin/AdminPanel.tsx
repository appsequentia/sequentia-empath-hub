
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AdminStats from "@/components/admin/AdminStats";
import PendingTherapists from "@/components/admin/PendingTherapists";
import UsersList from "@/components/admin/UsersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock authentication function - in a real app, this would check with your auth provider
const useAuth = () => {
  // Mock user data - in production this should come from your authentication system
  const user = {
    id: "1",
    name: "Admin User",
    role: "admin",
    isAuthenticated: true
  };
  
  return { user };
};

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      toast({
        title: "Bem-vinda ao painel administrativo",
        description: "Todos os dados foram carregados com sucesso.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  // Redirect non-admin users
  if (!user.isAuthenticated || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-8 bg-teal-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lavender-400"></div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
