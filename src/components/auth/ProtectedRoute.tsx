
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
  const [checkingRole, setCheckingRole] = useState(allowedRoles.length > 0 && !userRole);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && allowedRoles.length > 0 && !userRole) {
        setCheckingRole(false);
      } else {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, [user, allowedRoles, userRole]);

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
