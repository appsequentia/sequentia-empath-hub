
import React, { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StepIndicator from '@/components/auth/StepIndicator';

interface StepManagerProps {
  currentStep: number;
  totalSteps: number;
  formSubmitted: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  children: ReactNode;
}

export const StepManager: React.FC<StepManagerProps> = ({
  currentStep,
  totalSteps,
  formSubmitted,
  isLoading,
  onPrevStep,
  onNextStep,
  children
}) => {
  return (
    <>
      <div className="space-y-2">
        {!formSubmitted && (
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        )}
      </div>
      
      {/* Form Content */}
      {children}
      
      {!formSubmitted && (
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
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
              onClick={onNextStep}
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
            >
              {isLoading ? 'Processando...' : 'Finalizar cadastro'}
            </Button>
          )}
        </div>
      )}
    </>
  );
};
