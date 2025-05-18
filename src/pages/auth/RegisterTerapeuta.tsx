
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StepIndicator from "@/components/auth/StepIndicator";
import BasicInfoStep from "@/components/auth/therapist/BasicInfoStep";
import ProfessionalProfileStep from "@/components/auth/therapist/ProfessionalProfileStep";
import DocumentationStep from "@/components/auth/therapist/DocumentationStep";
import SuccessMessage from "@/components/auth/therapist/SuccessMessage";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert } from "@/components/ui/alert";

// Schema para validação do serviço de terapia
const serviceSchema = z.object({
  name: z.string().min(1, "Informe o nome da terapia"),
  duration: z.string().min(1, "Selecione a duração"),
  price: z.string().min(1, "Informe o valor"),
  description: z.string().optional(),
});

// Schema completo para validação de todos os campos do formulário
const registerSchema = z.object({
  // Etapa 1: Informações Básicas
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  
  // Etapa 2: Perfil Profissional
  professionalTitle: z.string().min(1, "Selecione um título profissional"),
  hasNoRegistration: z.boolean().optional(),
  registrationNumber: z.string().optional(),
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade"),
  biography: z.string().min(50, "A biografia deve ter pelo menos 50 caracteres"),
  approach: z.string().optional(), // Novo campo
  services: z.array(serviceSchema).min(1, "Adicione pelo menos um serviço"), // Novo campo
  sessionPrice: z.string().min(1, "Informe o valor da sessão"),
  sessionDuration: z.string().min(1, "Selecione a duração da sessão"),
  
  // Etapa 3: Documentação
  profilePicture: z.any().refine(val => !!val, {
    message: "A foto de perfil é obrigatória"
  }),
  certificate: z.any().refine(val => !!val, {
    message: "O certificado de formação é obrigatório"
  }),
  idDocument: z.any().refine(val => !!val, {
    message: "O documento de identidade é obrigatório"
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos de serviço e política de privacidade"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    // Se não tem registro, ignora a validação. Se tem, verifica se forneceu o número
    return data.hasNoRegistration === true || (data.registrationNumber && data.registrationNumber.length >= 3);
  },
  {
    message: "Número de registro inválido",
    path: ["registrationNumber"],
  }
);

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterTerapeuta() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      cpf: "",
      professionalTitle: "",
      registrationNumber: "",
      hasNoRegistration: false,
      specialties: [],
      biography: "",
      approach: "",
      services: [{ name: "", duration: "", price: "", description: "" }],
      sessionPrice: "",
      sessionDuration: "",
      termsAccepted: false,
    },
    mode: "onBlur",
  });
  
  // Helper function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Function to upload file to storage
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      console.log("Starting upload for file:", file.name, "to path:", path);
      if (!file) {
        console.error("No file provided for upload");
        return null;
      }
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      console.log("Uploading to:", filePath);
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('therapist_docs')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error(uploadError.message);
      }
      
      console.log("Upload successful, data:", data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('therapist_docs')
        .getPublicUrl(filePath);
        
      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('File upload error:', error);
      return null;
    }
  };
  
  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Submit function called with data:", data);
    setIsLoading(true);
    setFormError(null);
    
    try {
      console.log("Form submission started with data:", data);
      
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
          },
        },
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("No user returned from signUp");
        throw new Error("Falha ao criar conta de usuário");
      }
      
      console.log("User created successfully:", authData.user);
      
      // Prepare file uploads
      let profilePictureUrl = null;
      let certificateUrl = null;
      let idDocumentUrl = null;
      
      // Upload profile picture
      if (data.profilePicture && data.profilePicture instanceof File) {
        console.log("Uploading profile picture");
        profilePictureUrl = await uploadFile(
          data.profilePicture, 
          `profile-pics/${authData.user.id}`
        );
        
        if (!profilePictureUrl) {
          throw new Error("Não foi possível fazer upload da foto de perfil");
        }
        console.log("Profile picture uploaded:", profilePictureUrl);
      }
      
      // Upload certificate
      if (data.certificate && data.certificate instanceof File) {
        console.log("Uploading certificate");
        certificateUrl = await uploadFile(
          data.certificate, 
          `certificates/${authData.user.id}`
        );
        
        if (!certificateUrl) {
          throw new Error("Não foi possível fazer upload do certificado");
        }
        console.log("Certificate uploaded:", certificateUrl);
      }
      
      // Upload ID document
      if (data.idDocument && data.idDocument instanceof File) {
        console.log("Uploading ID document");
        idDocumentUrl = await uploadFile(
          data.idDocument, 
          `id-docs/${authData.user.id}`
        );
        
        if (!idDocumentUrl) {
          throw new Error("Não foi possível fazer upload do documento de identidade");
        }
        console.log("ID document uploaded:", idDocumentUrl);
      }
      
      // 2. Create therapist profile
      console.log("Creating therapist profile");
      const { data: profileData, error: profileError } = await supabase
        .from('therapist_profiles')
        .insert({
          id: authData.user.id,
          name: `${data.firstName} ${data.lastName}`,
          title: data.professionalTitle,
          bio: data.biography,
          approach: data.approach || "", 
          price: parseInt(data.services[0].price) || parseInt(data.sessionPrice) || 0,
          avatar: profilePictureUrl || "", 
          is_approved: false,
          specialty: data.specialties[0] || "",
          certificate_url: certificateUrl || "",
          id_document_url: idDocumentUrl || ""
        })
        .select();
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      } else {
        console.log("Profile created successfully:", profileData);
      }
      
      // 3. Add specializations
      if (data.specialties.length > 0) {
        console.log("Adding specializations");
        const specializationsToInsert = data.specialties.map(specialty => ({
          therapist_id: authData.user.id,
          specialization: specialty
        }));
        
        const { data: specData, error: specError } = await supabase
          .from('therapist_specializations')
          .insert(specializationsToInsert)
          .select();
          
        if (specError) {
          console.error("Error adding specializations:", specError);
          throw specError;
        } else {
          console.log("Specializations added successfully:", specData);
        }
      }

      // 4. Add services/therapies
      if (data.services && data.services.length > 0) {
        console.log("Adding services");
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
          const { data: servicesData, error: servicesError } = await supabase
            .from('therapist_services')
            .insert(servicesToInsert)
            .select();
            
          if (servicesError) {
            console.error("Error adding services:", servicesError);
            toast({
              title: "Aviso",
              description: "Seus serviços não puderam ser salvos. Você poderá adicioná-los mais tarde no painel.",
              variant: "default"
            });
          } else {
            console.log("Services added successfully:", servicesData);
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
  
  // Renderizar o conteúdo com base na etapa atual
  const renderStepContent = () => {
    if (formSubmitted) {
      return <SuccessMessage />;
    }
    
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <ProfessionalProfileStep form={form} />;
      case 3:
        return <DocumentationStep form={form} />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-180px)] pt-24 pb-16 px-4">
        <div className="w-full max-w-2xl">
          <Card className="border-lavender-400/20 bg-teal-800/40 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Cadastro de Terapeuta
              </CardTitle>
              <CardDescription className="text-center text-white/70">
                {!formSubmitted ? 
                  `Etapa ${currentStep} de ${totalSteps}: ${currentStep === 1 ? 'Informações Básicas' : currentStep === 2 ? 'Perfil Profissional' : 'Documentação'}` : 
                  "Cadastro enviado com sucesso!"}
              </CardDescription>
              
              {!formSubmitted && (
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
              )}
            </CardHeader>
            
            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{formError}</span>
                </Alert>
              )}
              
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderStepContent()}
                
                {!formSubmitted && (
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCurrentStep(prev => Math.max(prev - 1, 1));
                          setFormError(null);
                        }}
                        className="bg-transparent border-lavender-400/30 text-white hover:bg-lavender-400/10"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                    ) : (
                      <Link to="/login-terapeuta">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-transparent border-lavender-400/30 text-white hover:bg-lavender-400/10"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar para login
                        </Button>
                      </Link>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={() => {
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
                            
                            if (!hasNoRegistration) {
                              fieldsToValidate.push("registrationNumber");
                            }
                          }
                          
                          // Validate only fields for current step
                          form.trigger(fieldsToValidate as any).then(result => {
                            if (result) {
                              setCurrentStep(prev => Math.min(prev + 1, totalSteps));
                              setFormError(null);
                            } else {
                              // Highlight fields with errors
                              const errors = form.formState.errors;
                              console.log("Validation errors:", errors);
                            }
                          });
                        }}
                        className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
                      >
                        Próximo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
                        disabled={isLoading}
                        onClick={() => {
                          // Additional validation for the final step
                          const fieldsToValidate = ["profilePicture", "certificate", "idDocument", "termsAccepted"];
                          form.trigger(fieldsToValidate as any).then(result => {
                            if (!result) {
                              const errors = form.formState.errors;
                              console.log("Final validation errors:", errors);
                            }
                          });
                          
                          // The form.handleSubmit will be triggered by the form's onSubmit
                        }}
                      >
                        {isLoading ? 'Processando...' : 'Finalizar cadastro'}
                      </Button>
                    )}
                  </div>
                )}
              </form>
              
              {!formSubmitted && (
                <div className="mt-6 text-center">
                  <p className="text-white/70">
                    Já tem uma conta?{" "}
                    <Link 
                      to="/login-terapeuta" 
                      className="text-lavender-300 hover:text-lavender-400 font-medium"
                    >
                      Faça login
                    </Link>
                  </p>
                  <Link 
                    to="/register-cliente" 
                    className="block mt-3 text-white/70 hover:text-lavender-300 text-sm"
                  >
                    Cadastrar como cliente
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
