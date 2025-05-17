
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SuccessMessage = () => {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-lavender-400 mb-4" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        Cadastro enviado com sucesso!
      </h3>
      
      <p className="text-white/80 mb-6">
        Após o cadastro, nossos administradores revisarão suas informações. Você receberá um e-mail quando sua conta for aprovada.
      </p>
      
      <Link to="/login-terapeuta">
        <Button
          className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium"
        >
          Ir para página de login
        </Button>
      </Link>
    </div>
  );
};

export default SuccessMessage;
