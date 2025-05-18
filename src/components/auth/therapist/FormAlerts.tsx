
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormAlertsProps {
  formError: string | null;
  bucketReady: boolean;
}

export const FormAlerts: React.FC<FormAlertsProps> = ({ formError, bucketReady }) => {
  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      {bucketReady === false && (
        <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          <AlertDescription>
            O sistema de upload de documentos pode estar indisponível. 
            Isso pode causar problemas ao finalizar o cadastro.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
