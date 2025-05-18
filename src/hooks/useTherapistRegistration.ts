
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "./useFileUpload";
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
  const [bucketReady, setBucketReady] = useState(false);
  const totalSteps = 3;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uploadFile } = useFileUpload('therapist_docs');
  
  // Initialize bucket check
  const initBucket = async () => {
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
  };
  
  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    // Definir quais campos validar com base na etapa atual
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
      
      // Adiciona validação do número de registro apenas se não marcou a opção "Não possuo registro"
      if (!hasNoRegistration) {
        fieldsToValidate.push("registrationNumber");
      }
    } else if (currentStep === 3) {
      fieldsToValidate = ["profilePicture", "certificate", "idDocument", "termsAccepted"];
    }
    
    // Validar apenas os campos da etapa atual
    const result = await form.trigger(fieldsToValidate as any);
    
    if (result) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setFormError(null); // Limpa mensagens de erro ao avançar
    } else {
      // Se houver erro, destacar os campos com problemas
      const errors = form.formState.errors;
      console.log("Validation errors:", errors);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setFormError(null); // Limpa mensagens de erro ao voltar
  };
  
  const onSubmit = async (data: TherapistForm) => {
    console.log("Submit function called with data:", data);
    setIsLoading(true);
    setFormError(null);
    
    try {
      console.log("Form submission started with data:", { ...data, password: "[REDACTED]" });
      
      // Validate required files
      if (!data.profilePicture) {
        throw new Error("A foto de perfil é obrigatória");
      }
      
      if (!data.certificate) {
        throw new Error("O certificado de formação é obrigatório");
      }
      
      if (!data.idDocument) {
        throw new Error("O documento de identidade é obrigatório");
      }
      
      if (!data.termsAccepted) {
        throw new Error("Você precisa aceitar os termos de serviço");
      }
      
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
      
      console.log("User created successfully:", authData.user.id);
      
      // Upload files
      let profilePictureUrl = null;
      let certificateUrl = null;
      let idDocumentUrl = null;
      
      // Upload profile picture
      if (data.profilePicture && data.profilePicture instanceof File) {
        profilePictureUrl = await uploadFile(
          data.profilePicture, 
          `profile-pics/${authData.user.id}`
        );
      }
      
      // Upload certificate
      if (data.certificate && data.certificate instanceof File) {
        certificateUrl = await uploadFile(
          data.certificate, 
          `certificates/${authData.user.id}`
        );
      }
      
      // Upload ID document
      if (data.idDocument && data.idDocument instanceof File) {
        idDocumentUrl = await uploadFile(
          data.idDocument, 
          `id-docs/${authData.user.id}`
        );
      }
      
      // 2. Create therapist profile
      const { error: profileError } = await supabase
        .from('therapist_profiles')
        .insert({
          id: authData.user.id,
          name: `${data.firstName} ${data.lastName}`,
          title: data.professionalTitle,
          bio: data.biography,
          approach: data.approach || "", 
          price: parseInt(data.services[0]?.price) || parseInt(data.sessionPrice) || 0,
          avatar: profilePictureUrl || "", 
          is_approved: false,
          specialty: data.specialties[0] || "",
          certificate_url: certificateUrl || "",
          id_document_url: idDocumentUrl || ""
        });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      }
      
      // 3. Add specializations
      if (data.specialties.length > 0) {
        const specializationsToInsert = data.specialties.map(specialty => ({
          therapist_id: authData.user.id,
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
        const servicesToInsert = data.services
          .filter(service => service.name && service.price)
          .map(service => ({
            therapist_id: authData.user.id,
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
