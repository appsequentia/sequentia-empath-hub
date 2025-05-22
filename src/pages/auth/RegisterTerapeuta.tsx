
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BasicInfoStep from "@/components/auth/therapist/BasicInfoStep";
import ProfessionalProfileStep from "@/components/auth/therapist/ProfessionalProfileStep";
import SuccessMessage from "@/components/auth/therapist/SuccessMessage";
import { FormAlerts } from "@/components/auth/therapist/FormAlerts";
import { StepManager } from "@/components/auth/therapist/StepManager";
import { FormFooterLinks } from "@/components/auth/therapist/FormFooterLinks";
import { useTherapistRegistration, TherapistForm } from "@/hooks/useTherapistRegistration";

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
  approach: z.string().optional(),
  services: z.array(serviceSchema).min(1, "Adicione pelo menos um serviço"),
  sessionPrice: z.string().min(1, "Informe o valor da sessão"),
  sessionDuration: z.string().min(1, "Selecione a duração da sessão"),
  
  // Campos opcionais que serão definidos com valores padrão
  profilePicture: z.any().optional(),
  certificate: z.any().optional(),
  idDocument: z.any().optional(),
  termsAccepted: z.boolean().default(true)
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    return data.hasNoRegistration === true || (data.registrationNumber && data.registrationNumber.length >= 3);
  },
  {
    message: "Número de registro inválido",
    path: ["registrationNumber"],
  }
);

export default function RegisterTerapeuta() {
  const form = useForm<TherapistForm>({
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
      termsAccepted: true, // Definido como true por padrão
      profilePicture: null,
      certificate: null,
      idDocument: null
    },
    mode: "onBlur",
  });
  
  const { 
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
  } = useTherapistRegistration(form);
  
  // Initialize bucket on component mount, but don't block rendering if it fails
  useEffect(() => {
    try {
      initBucket().catch(error => {
        console.error("Failed to initialize bucket, continuing anyway:", error);
        // Continue with the form regardless of bucket status
      });
    } catch (error) {
      console.error("Error during bucket initialization:", error);
      // Continue with the form regardless of bucket status
    }
  }, [initBucket]);
  
  const handleSubmit = form.handleSubmit(onSubmit);
  
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
                  `Etapa ${currentStep} de ${totalSteps}: ${currentStep === 1 ? 'Informações Básicas' : 'Perfil Profissional'}` : 
                  "Cadastro enviado com sucesso!"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormAlerts formError={formError} bucketReady={bucketReady} />
              
              <form onSubmit={handleSubmit}>
                <StepManager
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  formSubmitted={formSubmitted}
                  isLoading={isLoading}
                  onPrevStep={prevStep}
                  onNextStep={nextStep}
                  onSubmit={currentStep === totalSteps ? handleSubmit : undefined}
                >
                  {renderStepContent()}
                </StepManager>
              </form>
              
              <FormFooterLinks formSubmitted={formSubmitted} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};
