
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { fetchUserRole, createOrUpdateUserProfile } from "@/utils/authUtils";
import { AuthContextType } from "./AuthContextTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut } = useAuthOperations();

  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Buscar role do usuário quando fizer login
          // Usamos setTimeout(0) para evitar deadlocks com outros eventos do Supabase
          setTimeout(() => {
            handleUserRole(currentSession.user.id);
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setUserRole(null);
          navigate('/login-cliente');
        }
      }
    );

    // Verificar sessão atual
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await handleUserRole(initialSession.user.id);
        }
      } catch (error) {
        console.error("Erro ao buscar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Função para buscar ou criar a role do usuário e redirecionar adequadamente
  const handleUserRole = async (userId: string) => {
    try {
      setIsLoading(true);
      let role = await fetchUserRole(userId);

      // Se não tiver role, tentar criar um perfil com role padrão
      if (!role) {
        // Buscar informações do usuário para o nome
        const { data: userData } = await supabase.auth.getUser();
        const firstName = userData?.user?.user_metadata?.first_name || '';
        const lastName = userData?.user?.user_metadata?.last_name || '';
        
        // Criar perfil com role cliente padrão
        role = await createOrUpdateUserProfile(userId, 'cliente', firstName, lastName);
        
        // Se mesmo assim falhou, use o default
        if (!role) {
          role = 'cliente';
        }
      }
      
      console.log("Role encontrada ou criada:", role);
      setUserRole(role);
      
      // Redirecionar com base na role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'terapeuta') {
        navigate('/dashboard-terapeuta');
      } else if (role === 'cliente') {
        navigate('/dashboard-cliente');
      }
    } catch (err) {
      console.error('Erro ao gerenciar role do usuário:', err);
      // Default to cliente if all else fails
      setUserRole('cliente');
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper functions to preserve the original API
  const signIn = async (email: string, password: string, userType?: string) => {
    await authSignIn(email, password, userType);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType?: string) => {
    await authSignUp(email, password, firstName, lastName, userType);
  };

  const signOut = async () => {
    await authSignOut();
  };

  const value = {
    session,
    user,
    userRole,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
