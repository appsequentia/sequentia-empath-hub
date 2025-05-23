
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
  const location = useLocation();

  console.log('Protected Route Debug:', { 
    isLoading, 
    user: !!user, 
    userRole, 
    allowedRoles,
    hasAccess: allowedRoles.length === 0 || (userRole && allowedRoles.includes(userRole)),
    currentPath: location.pathname,
    redirectPath
  });

  // Se ainda está carregando o usuário, mostra um spinner
  if (isLoading) {
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
