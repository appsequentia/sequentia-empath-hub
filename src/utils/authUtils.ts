
import { supabase } from "@/integrations/supabase/client";

/**
 * Clean up auth state by removing Supabase auth keys from localStorage and sessionStorage
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Create or update a user profile with the given role
 */
export const createOrUpdateUserProfile = async (userId: string, role: string, firstName?: string, lastName?: string) => {
  try {
    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil:', profileError);
      return null;
    }
    
    // If the profile doesn't exist, create a new one
    if (!profileData) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId, 
          first_name: firstName || '',
          last_name: lastName || '',
          role: role 
        }])
        .select('role')
        .single();
        
      if (error) {
        console.error('Erro ao criar perfil:', error);
        return null;
      }
      
      return data?.role || null;
    } else {
      // If the profile exists, update the role
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select('role')
        .single();
        
      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return null;
      }
      
      return data?.role || null;
    }
  } catch (err) {
    console.error('Erro ao criar ou atualizar perfil:', err);
    return null;
  }
};

/**
 * Fetch the user role from the profiles table
 */
export const fetchUserRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar role do usuário:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (err) {
    console.error('Erro ao buscar role do usuário:', err);
    return null;
  }
};
