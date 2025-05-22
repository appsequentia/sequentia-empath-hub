
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState, createOrUpdateUserProfile } from "@/utils/authUtils";

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string, userType?: string) => {
    try {
      setIsLoading(true);
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
        console.log("Usuário logado:", data.user);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo(a) de volta!",
        });
      }
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType?: string) => {
    try {
      setIsLoading(true);
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
        await createOrUpdateUserProfile(
          data.user.id, 
          userType || 'cliente', 
          firstName, 
          lastName
        );
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      
      // Redirecionar para login
      navigate(userType === 'terapeuta' ? '/login-terapeuta' : '/login-cliente');
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer cadastro",
        description: error.message || "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da sua conta.",
      });
      
      // Força atualização da página para limpar qualquer estado
      window.location.href = '/login-cliente';
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Não foi possível sair da conta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};
