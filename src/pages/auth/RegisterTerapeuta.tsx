
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  sessionPrice: z.string().min(1, "Informe o valor da sessão"),
  sessionDuration: z.string().min(1, "Selecione a duração da sessão"),
  
  // Etapa 3: Documentação
  profilePicture: z.any().optional(),
  certificate: z.any().optional(),
  idDocument: z.any().optional(),
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
      sessionPrice: "",
      sessionDuration: "",
      termsAccepted: false,
    },
    mode: "onBlur",
  });
  
  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
    setFormSubmitted(true);
    // Integração futura com Supabase
  };
  
  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    // Definir quais campos validar com base na etapa atual
    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "password", "confirmPassword", "phone", "cpf"];
    } else if (currentStep === 2) {
      const hasNoRegistration = form.watch("hasNoRegistration");
      fieldsToValidate = ["professionalTitle", "specialties", "biography", "sessionPrice", "sessionDuration"];
      
      // Adiciona validação do número de registro apenas se não marcou a opção "Não possuo registro"
      if (!hasNoRegistration) {
        fieldsToValidate.push("registrationNumber");
      }
    } else if (currentStep === 3) {
      fieldsToValidate = ["termsAccepted"];
    }
    
    // Validar apenas os campos da etapa atual
    const result = await form.trigger(fieldsToValidate as any);
    
    if (result) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderStepContent()}
                
                {!formSubmitted && (
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="bg-transparent border-lavender-400/30 text-white hover:bg-lavender-400/10"
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
                        onClick={nextStep}
                        className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
                      >
                        Próximo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
                      >
                        Finalizar cadastro
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
