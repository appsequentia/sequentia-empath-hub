
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StepManagerProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  formSubmitted: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => Promise<void>;
}

export const StepManager = ({ 
  children, 
  currentStep, 
  totalSteps, 
  formSubmitted,
  isLoading,
  onPrevStep, 
  onNextStep 
}: StepManagerProps) => {
  
  // For the last step, show the final submit button
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="space-y-8">
      {/* Content */}
      <div className={formSubmitted ? "animate-pulse" : ""}>
        {children}
      </div>
      
      {/* Navigation buttons */}
      {!formSubmitted && (
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={onPrevStep}
            disabled={currentStep === 1 || isLoading}
            className="bg-transparent border border-lavender-400/30 text-white hover:bg-lavender-400/10"
          >
            Voltar
          </Button>
          
          <Button 
            type={isLastStep ? "submit" : "button"}
            onClick={isLastStep ? undefined : onNextStep}
            disabled={isLoading}
            className={isLastStep 
              ? "bg-lavender-400 hover:bg-lavender-500 text-teal-900" 
              : "bg-lavender-400/30 hover:bg-lavender-400/40 text-white"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLastStep ? "Enviando..." : "Carregando..."}
              </>
            ) : (
              isLastStep ? "Finalizar Cadastro" : "Próximo"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
