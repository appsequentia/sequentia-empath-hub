
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/auth/StepIndicator";

interface StepManagerProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  formSubmitted: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit?: () => void;
}

export const StepManager = ({
  children,
  currentStep,
  totalSteps,
  formSubmitted,
  isLoading,
  onPrevStep,
  onNextStep,
  onSubmit,
}: StepManagerProps) => {
  // Se o formulário foi enviado, não mostrar os controles de navegação
  if (formSubmitted) {
    return <>{children}</>;
  }
  
  // Verificar se está na última etapa
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="space-y-8">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      
      <div className="mt-6">
        {children}
      </div>
      
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevStep}
            disabled={isLoading}
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            Voltar
          </Button>
        ) : (
          <div></div> // Espaço vazio para manter o layout alinhado
        )}
        
        <Button 
          type={isLastStep ? "submit" : "button"} 
          onClick={isLastStep ? onSubmit : onNextStep}
          disabled={isLoading}
          className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
        >
          {isLoading ? (
            "Processando..."
          ) : isLastStep ? (
            "Finalizar Cadastro"
          ) : (
            "Próximo"
          )}
        </Button>
      </div>
    </div>
  );
};
