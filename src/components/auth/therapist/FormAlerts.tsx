
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface FormAlertsProps {
  formError: string | null;
  bucketReady: boolean | null;
}

export const FormAlerts = ({ formError, bucketReady }: FormAlertsProps) => {
  // Don't show any alerts if there are no issues
  if (!formError && bucketReady !== false) return null;
  
  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Erro no cadastro</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      {bucketReady === false && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4 text-orange-400 mr-2" />
          <AlertTitle>Sistema de upload limitado</AlertTitle>
          <AlertDescription>
            O sistema de upload de arquivos pode estar com funcionamento limitado.
            Você poderá continuar o cadastro, mas talvez precise enviar documentos posteriormente.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
