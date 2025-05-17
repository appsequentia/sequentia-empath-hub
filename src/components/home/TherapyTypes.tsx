
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Sprout, Users, Smile, Paintbrush, ArrowRight } from "lucide-react";

const therapyTypes = [
  {
    id: "1",
    name: "Terapia Cognitivo-Comportamental",
    icon: <Brain className="h-5 w-5 text-lavender-400" />,
    description: "Foca na identificação e mudança de padrões de pensamento e comportamento negativos."
  },
  {
    id: "2",
    name: "Psicanálise",
    icon: <Sparkles className="h-5 w-5 text-lavender-400" />,
    description: "Explora o inconsciente para resolver conflitos internos e questões profundas."
  },
  {
    id: "3",
    name: "Terapia Humanista",
    icon: <Sprout className="h-5 w-5 text-lavender-400" />,
    description: "Centrada na pessoa e no desenvolvimento do potencial humano."
  },
  {
    id: "4",
    name: "Terapia Sistêmica",
    icon: <Users className="h-5 w-5 text-lavender-400" />,
    description: "Aborda problemas no contexto das relações e sistemas familiares."
  },
  {
    id: "5",
    name: "Mindfulness",
    icon: <Smile className="h-5 w-5 text-lavender-400" />,
    description: "Práticas de atenção plena para redução de estresse e ansiedade."
  },
  {
    id: "6",
    name: "Arteterapia",
    icon: <Paintbrush className="h-5 w-5 text-lavender-400" />,
    description: "Utiliza a expressão artística como meio terapêutico."
  }
];

export function TherapyTypes() {
  return (
    <section className="py-16 md:py-24 bg-teal-800/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Tipos de <span className="text-lavender-400">terapias</span>
          </h2>
          <p className="mt-4 text-white/80">
            Conheça as principais abordagens terapêuticas disponíveis em nossa plataforma
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {therapyTypes.map((therapy) => (
            <Link key={therapy.id} to={`/therapies/${therapy.id}`}>
              <Card className="bg-teal-700/40 hover:bg-teal-700/60 backdrop-blur-sm border-lavender-400/20 transition-all duration-300 h-full hover:shadow-lg hover:shadow-lavender-400/10">
                <CardContent className="p-6">
                  <div className="bg-teal-600/30 p-3 inline-block rounded-lg mb-4">
                    {therapy.icon}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{therapy.name}</h3>
                  <p className="text-white/80 text-sm">{therapy.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/therapies">
            <Button 
              className="bg-transparent hover:bg-lavender-400/10 border border-lavender-400 text-white group"
            >
              Ver todas as terapias
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
