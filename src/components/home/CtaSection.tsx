
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-lavender-400/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-2xl p-8 md:p-12 border border-lavender-400/30 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Comece sua jornada de autoconhecimento hoje
            </h2>
            
            <p className="text-white/80 mb-8">
              Nosso processo de diagnóstico emocional é rápido, seguro e totalmente 
              gratuito. Em poucos minutos, você receberá recomendações personalizadas 
              de terapeutas alinhados com suas necessidades.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/assessment/start">
                <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium px-6 py-5 text-lg w-full sm:w-auto">
                  Fazer avaliação gratuita
                </Button>
              </Link>
              <Link to="/login-client">
                <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20 px-6 py-5 text-lg w-full sm:w-auto">
                  Já tenho uma conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
