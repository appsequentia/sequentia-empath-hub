
import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              step === currentStep
                ? "bg-lavender-400 scale-125"
                : step < currentStep
                ? "bg-lavender-400/70"
                : "bg-white/30"
            )}
          />
          {step < totalSteps && (
            <div
              className={cn(
                "w-8 h-0.5",
                step < currentStep ? "bg-lavender-400/70" : "bg-white/30"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
