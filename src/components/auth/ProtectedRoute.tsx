
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Se ainda está carregando, pode mostrar um spinner ou tela de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login-cliente" />;
  }

  // Se não houver roles específicas ou se a verificação de roles não for implementada ainda,
  // permite o acesso (implementação básica)
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Para verificação de roles, você precisaria implementar a lógica aqui
  // Por exemplo, verificar se o usuário tem a role necessária
  // const userHasRequiredRole = user.roles?.some(role => allowedRoles.includes(role));

  // Temporariamente, permitimos acesso se houver um usuário autenticado
  // Você pode melhorar isso mais tarde com uma verificação real de roles
  return <>{children}</>;
};

export default ProtectedRoute;
