
import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { createTherapistDocumentsBucket } from "@/integrations/supabase/createBucket";

export interface TherapistForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  cpf: string;
  professionalTitle: string;
  registrationNumber?: string;
  hasNoRegistration?: boolean;
  specialties: string[];
  biography: string;
  approach: string;
  services: Array<{
    name: string;
    duration: string;
    price: string;
    description?: string;
  }>;
  sessionPrice: string;
  sessionDuration: string;
  profilePicture: File | null;
  certificate: File | null;
  idDocument: File | null;
  termsAccepted: boolean;
}

export const useTherapistRegistration = (form: UseFormReturn<TherapistForm>) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bucketReady, setBucketReady] = useState<boolean | null>(null);
  const totalSteps = 2; // Alterado de 3 para 2
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize bucket check - fallback to true if check fails to prevent blocking UI
  const initBucket = useCallback(async () => {
    try {
      const result = await createTherapistDocumentsBucket();
      console.log("Bucket initialization result:", result);
      setBucketReady(result);
      
      if (!result) {
        toast({
          title: "Aviso de Sistema",
          description: "O sistema de upload de arquivos pode estar indisponível temporariamente. Alguns recursos podem não funcionar corretamente.",
          variant: "destructive",
          duration: 6000
        });
      }
    } catch (error) {
      console.error("Failed to check bucket status:", error);
      // Fallback to assume bucket is ready to prevent blocking UI
      setBucketReady(true);
    }
  }, [toast]);
  
  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    // Define which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "password", "confirmPassword", "phone", "cpf"];
    } else if (currentStep === 2) {
      const hasNoRegistration = form.watch("hasNoRegistration");
      fieldsToValidate = [
        "professionalTitle", 
        "specialties", 
        "biography", 
        "approach", 
        "services"
      ];
      
      // Add validation for registration number only if not marked "No registration"
      if (!hasNoRegistration) {
        fieldsToValidate.push("registrationNumber");
      }
    }
    
    // Validate only fields for current step
    const result = await form.trigger(fieldsToValidate as any);
    
    if (result) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setFormError(null); // Clear error messages when advancing
    } else {
      // Highlight fields with problems
      const errors = form.formState.errors;
      console.log("Validation errors:", errors);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setFormError(null); // Clear error messages when going back
  };
  
  // Check if therapist profile already exists
  const checkExistingProfile = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('therapist_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      return !!data; // Return true if profile exists
    } catch (error) {
      console.error("Error checking existing profile:", error);
      return false;
    }
  };
  
  const onSubmit = async (data: TherapistForm) => {
    console.log("Submit function called with data:", data);
    setIsLoading(true);
    setFormError(null);
    
    try {
      console.log("Form submission started with data:", { ...data, password: "[REDACTED]" });
      
      // Não é mais necessário validar documentos obrigatórios
      
      console.log("Basic validation passed, proceeding with auth signup");
      
      // 1. Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            cpf: data.cpf,
            user_type: "terapeuta",
          },
        },
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("User already registered")) {
          throw new Error("Email já cadastrado. Utilize outro email ou faça login.");
        }
        throw authError;
      }
      
      if (!authData.user) {
        console.error("No user returned from signUp");
        throw new Error("Falha ao criar conta de usuário");
      }
      
      const userId = authData.user.id;
      console.log("User created successfully:", userId);
      
      try {
        // Check if therapist profile already exists
        const profileExists = await checkExistingProfile(userId);
        console.log("Profile exists:", profileExists);
        
        // 2. Create or update therapist profile
        const profileData = {
          id: userId,
          name: `${data.firstName} ${data.lastName}`,
          title: data.professionalTitle,
          bio: data.biography,
          approach: data.approach || "", 
          price: parseInt(data.services[0]?.price) || parseInt(data.sessionPrice) || 0,
          avatar: "", // Avatar vazio, já que não há mais upload
          is_approved: false,
          specialty: data.specialties[0] || "",
          certificate_url: "", // URL de certificado vazia
          id_document_url: "" // URL de documento vazia
        };
        
        const { error: profileError } = profileExists 
          ? await supabase
              .from('therapist_profiles')
              .update(profileData)
              .eq('id', userId)
          : await supabase
              .from('therapist_profiles')
              .insert(profileData);
        
        if (profileError) {
          console.error("Error creating/updating profile:", profileError);
          throw profileError;
        }
        
        // 3. Add specializations
        if (data.specialties.length > 0) {
          // Delete existing specializations first if profile already exists
          if (profileExists) {
            await supabase
              .from('therapist_specializations')
              .delete()
              .eq('therapist_id', userId);
          }
          
          const specializationsToInsert = data.specialties.map(specialty => ({
            therapist_id: userId,
            specialization: specialty
          }));
          
          const { error: specError } = await supabase
            .from('therapist_specializations')
            .insert(specializationsToInsert);
            
          if (specError) {
            console.error("Error adding specializations:", specError);
            // Continue despite error, not critical
          }
        }

        // 4. Add services/therapies
        if (data.services && data.services.length > 0) {
          // Delete existing services first if profile already exists
          if (profileExists) {
            await supabase
              .from('therapist_services')
              .delete()
              .eq('therapist_id', userId);
          }
          
          const servicesToInsert = data.services
            .filter(service => service.name && service.price)
            .map(service => ({
              therapist_id: userId,
              name: service.name,
              description: service.description || "",
              duration: parseInt(service.duration) || 50,
              price: parseFloat(service.price) || 0
            }));
          
          if (servicesToInsert.length > 0) {
            const { error: servicesError } = await supabase
              .from('therapist_services')
              .insert(servicesToInsert);
              
            if (servicesError) {
              console.error("Error adding services:", servicesError);
              toast({
                title: "Aviso",
                description: "Seus serviços não puderam ser salvos. Você poderá adicioná-los mais tarde no painel.",
                variant: "default"
              });
            }
          }
        }
        
        // Success!
        console.log("Registration completed successfully");
        setFormSubmitted(true);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Seu cadastro foi enviado para análise. Você receberá um email quando for aprovado.",
          variant: "default"
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login-terapeuta');
        }, 3000);
        
      } catch (error: any) {
        console.error("Error in processing data:", error);
        throw new Error(`Erro ao processar dados: ${error.message}`);
      }
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.");
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    currentStep,
    totalSteps,
    formSubmitted,
    isLoading,
    formError,
    bucketReady,
    nextStep,
    prevStep,
    onSubmit,
    initBucket
  };
};
