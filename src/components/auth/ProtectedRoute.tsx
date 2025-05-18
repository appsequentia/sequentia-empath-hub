
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = "/login-cliente" 
}: ProtectedRouteProps) => {
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
            // Handle the case where profile doesn't exist yet
            if (error.code === 'PGRST116') { 
              console.log('User profile not found, treating as default role');
              setUserRole('user'); // Default role for new users
            } else {
              console.error('Erro ao buscar role do usuário:', error);
              setUserRole(null);
            }
          } else if (data) {
            console.log('User role found:', data.role);
            setUserRole(data.role || 'user'); // Use 'user' as fallback if role is null
          } else {
            console.log('No user role data found, using default');
            setUserRole('user'); // Default if no data returned but no error
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
    return <Navigate to={redirectPath} />;
  }

  // Se houver roles específicas necessárias e o usuário não tiver uma delas, nega o acesso
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    console.log(`Access denied: User role ${userRole} not in allowed roles [${allowedRoles.join(', ')}]`);
    return <Navigate to="/" replace />;
  }

  // Caso contrário, permite o acesso
  console.log(`Access granted to user with role: ${userRole}`);
  return <>{children}</>;
};

export default ProtectedRoute;
