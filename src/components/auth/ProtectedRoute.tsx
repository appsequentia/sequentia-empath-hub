
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const { user, isLoading, userRole } = useAuth();
  const [checkingRole, setCheckingRole] = useState(false);
  const location = useLocation();

  // Verificamos as roles apenas se houver restrições e se houver um usuário logado
  useEffect(() => {
    const checkUserRole = async () => {
      if (user && allowedRoles.length > 0) {
        setCheckingRole(true);
        
        try {
          // Verificar role do usuário diretamente do banco de dados
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Erro ao verificar role do usuário:', error);
            setCheckingRole(false);
          } else {
            setCheckingRole(false);
          }
        } catch (error) {
          console.error('Erro ao verificar role do usuário:', error);
          setCheckingRole(false);
        }
      }
    };

    if (user && allowedRoles.length > 0) {
      checkUserRole();
    } else {
      setCheckingRole(false);
    }
  }, [user, allowedRoles]);

  console.log('Protected Route Debug:', { 
    isLoading, 
    checkingRole, 
    user: !!user, 
    userRole, 
    allowedRoles,
    hasAccess: allowedRoles.length === 0 || (userRole && allowedRoles.includes(userRole)),
    currentPath: location.pathname,
    redirectPath
  });

  // Se ainda está carregando o usuário ou verificando a role, mostra um spinner
  if (isLoading || checkingRole) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location.pathname }} />;
  }

  // Se houver roles específicas necessárias e o usuário não tiver uma delas, nega o acesso
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar esta página. Esta área é restrita para {allowedRoles.join(', ')}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Caso contrário, permite o acesso
  return <>{children}</>;
};

export default ProtectedRoute;
