
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-lavender-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-lavender-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lavender-400/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* "Criar Conta" button for larger screens - positioned absolutely */}
        <div className="absolute top-0 right-0 hidden md:block z-20">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium">
                Criar Conta
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-teal-800 border-lavender-400/30 p-0 w-48">
              <div className="flex flex-col">
                <Link 
                  to="/register-cliente" 
                  className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors"
                >
                  Sou Cliente
                </Link>
                <Link 
                  to="/register-terapeuta"
                  className="text-white hover:bg-lavender-400/20 px-4 py-3 text-sm transition-colors"
                >
                  Sou Terapeuta
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>

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
            
            {/* "Criar Conta" button for mobile - displayed inline with other buttons */}
            <div className="md:hidden mt-10 mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900 font-medium py-6 text-lg">
                    Criar Conta
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-teal-800 border-lavender-400/30 p-0 w-full">
                  <div className="flex flex-col">
                    <Link 
                      to="/register-cliente" 
                      className="text-white hover:bg-lavender-400/20 px-4 py-4 text-base transition-colors"
                    >
                      Sou Cliente
                    </Link>
                    <Link 
                      to="/register-terapeuta"
                      className="text-white hover:bg-lavender-400/20 px-4 py-4 text-base transition-colors"
                    >
                      Sou Terapeuta
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
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
              <div className="relative bg-teal-800/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-auto text-xs text-white/70">Sequentia Diagnóstico</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-teal-700/50 p-4 rounded-lg">
                    <p className="text-white/90">Como você se sente nas situações sociais?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="bg-lavender-400/20 text-white px-3 py-1 rounded-full text-sm">Confortável</div>
                      <div className="bg-lavender-400 text-teal-900 px-3 py-1 rounded-full text-sm">Ansioso</div>
                      <div className="bg-lavender-400/20 text-white px-3 py-1 rounded-full text-sm">Indiferente</div>
                    </div>
                  </div>
                  <div className="bg-teal-700/30 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/70">Progresso</span>
                      <span className="text-xs text-lavender-300">3 de 10</span>
                    </div>
                    <div className="mt-2 w-full bg-teal-700/50 rounded-full h-2">
                      <div className="bg-lavender-400 h-2 rounded-full" style={{width: "30%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
