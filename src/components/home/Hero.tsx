
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-lavender-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender-400/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
            Encontre seu caminho para o <span className="text-lavender-300">equilíbrio emocional</span>
          </h1>
          
          <p className="mt-6 text-lg text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Conectamos você com terapeutas qualificados através de um processo 
            inteligente que identifica suas necessidades emocionais e recomenda 
            os melhores especialistas.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/assessment/start">
              <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium px-8 py-6 text-lg w-full sm:w-auto">
                Iniciar diagnóstico
              </Button>
            </Link>
            <Link to="/specialists">
              <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20 px-8 py-6 text-lg w-full sm:w-auto">
                Ver especialistas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
