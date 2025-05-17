
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(allowedRoles.length > 0);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && allowedRoles.length > 0) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Erro ao buscar role do usuário:', error);
            setUserRole(null);
          } else {
            setUserRole(data?.role || null);
          }
        } catch (err) {
          console.error('Erro ao verificar permissões:', err);
          setUserRole(null);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, [user, allowedRoles]);

  // Se ainda está carregando o usuário ou verificando a role, mostra um spinner
  if (isLoading || checkingRole) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login-cliente" />;
  }

  // Se houver roles específicas necessárias e o usuário não tiver uma delas, nega o acesso
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  // Caso contrário, permite o acesso
  return <>{children}</>;
};

export default ProtectedRoute;
