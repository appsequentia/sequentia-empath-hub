
import React from "react";
import { Link } from "react-router-dom";

interface FormFooterLinksProps {
  formSubmitted: boolean;
}

export const FormFooterLinks: React.FC<FormFooterLinksProps> = ({ formSubmitted }) => {
  if (formSubmitted) {
    return null;
  }
  
  return (
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
  );
};
