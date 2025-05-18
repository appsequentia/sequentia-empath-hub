
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <React.Fragment key={`step-${stepNumber}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isActive 
                  ? "bg-lavender-400 text-teal-900" 
                  : isCompleted 
                    ? "bg-green-500 text-white" 
                    : "bg-teal-900/50 text-white/50"
              }`}
            >
              {isCompleted ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < totalSteps && (
              <div 
                className={`h-1 w-6 ${
                  stepNumber < currentStep 
                    ? "bg-green-500" 
                    : "bg-teal-900/30"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
