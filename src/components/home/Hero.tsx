
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { DiagnosticPreviewCarousel } from "./DiagnosticPreviewCarousel";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-lavender-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-lavender-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-400/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Removendo o botão "Criar Conta" que estava posicionado aqui */}
        
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
              Encontre o caminho para o seu <span className="text-lavender-300">bem-estar emocional</span>
            </h1>
            
            <p className="mt-6 text-xl text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Conectamos você com terapeutas qualificados através de um processo 
              inteligente que identifica suas necessidades e recomenda 
              os melhores especialistas para o seu perfil.
            </p>
            
            {/* Removi o botão duplicado para dispositivos móveis */}
            
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/assessment/start">
                <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium px-8 py-6 text-lg w-full sm:w-auto group">
                  Iniciar diagnóstico
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/specialists">
                <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20 px-8 py-6 text-lg w-full sm:w-auto">
                  Ver especialistas
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-lavender-300 flex items-center justify-center text-sm text-teal-900">J</div>
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-sm text-white">M</div>
                <div className="w-10 h-10 rounded-full bg-lavender-400 flex items-center justify-center text-sm text-teal-900">L</div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm text-white">+</div>
              </div>
              <p className="text-white/70 text-sm">
                Junte-se a mais de <span className="text-white font-medium">2.500 pessoas</span> que já encontraram seus terapeutas ideais
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2 hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-lavender-400/30 to-teal-600/30 rounded-2xl blur-md"></div>
              <DiagnosticPreviewCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
