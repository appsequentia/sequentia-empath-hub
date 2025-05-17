
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string, userType?: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Buscar role do usuário quando fizer login
          fetchUserRole(currentSession.user.id);
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
          await fetchUserRole(initialSession.user.id);
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
  
  // Função para buscar a role do usuário
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setUserRole(null);
      } else {
        setUserRole(data?.role || 'user');
      }
    } catch (err) {
      console.error('Erro ao buscar role do usuário:', err);
      setUserRole(null);
    }
  };

  // Limpar estado de autenticação
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const signIn = async (email: string, password: string, userType?: string) => {
    try {
      // Limpar estado antes de fazer login
      cleanupAuthState();
      
      // Tentativa de logout global
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continua mesmo que falhe
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          
          const userRole = profileData?.role || 'user';
          setUserRole(userRole);
          
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo(a) de volta!",
          });
          
          // Redirecionamento baseado na role ou no tipo de usuário selecionado
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userType === 'terapeuta' || userRole === 'terapeuta') {
            navigate('/dashboard-terapeuta');
          } else {
            navigate('/dashboard-cliente');
          }
          
          return;
        } catch (err) {
          console.error("Erro ao verificar perfil:", err);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType?: string) => {
    try {
      // Limpar estado antes de fazer cadastro
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType || 'cliente', // Armazena o tipo de usuário nos metadados
          }
        }
      });

      if (error) {
        throw error;
      }
      
      // Se o cadastro for bem sucedido, atualiza a role do usuário na tabela profiles
      if (data.user) {
        // Note: A trigger no Supabase já cria o profile, então só precisamos atualizar a role
        await supabase
          .from('profiles')
          .update({ role: userType || 'cliente' })
          .eq('id', data.user.id);
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      
      // Redirecionar para login
      navigate(userType === 'terapeuta' ? '/login-terapeuta' : '/login-cliente');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer cadastro",
        description: error.message || "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da sua conta.",
      });
      
      // Força atualização da página para limpar qualquer estado
      window.location.href = '/login-cliente';
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Não foi possível sair da conta. Tente novamente.",
        variant: "destructive",
      });
    }
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
