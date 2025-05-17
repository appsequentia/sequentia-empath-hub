
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Brain, 
  Sparkles, 
  Sprout, 
  Users, 
  Smile, 
  Paintbrush 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Therapy type data with expanded information
const therapyTypes = [
  {
    id: "1",
    name: "Terapia Cognitivo-Comportamental",
    icon: <Brain className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Foca na identificação e mudança de padrões de pensamento e comportamento negativos.",
    description: "A Terapia Cognitivo-Comportamental (TCC) é uma abordagem estruturada que trabalha com a premissa de que nossos pensamentos afetam nossos comportamentos e emoções. Ajuda a identificar pensamentos distorcidos e desenvolver estratégias práticas para lidar com problemas específicos.",
    benefits: [
      "Resultados em um período relativamente curto",
      "Abordagem prática e orientada para soluções",
      "Desenvolvimento de habilidades que podem ser usadas ao longo da vida",
      "Eficácia comprovada para ansiedade, depressão e outros transtornos"
    ],
    idealFor: [
      "Ansiedade", "Depressão", "Transtornos de humor", "Fobias", "Vícios", "Estresse"
    ]
  },
  {
    id: "2",
    name: "Psicanálise",
    icon: <Sparkles className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Explora o inconsciente para resolver conflitos internos e questões profundas.",
    description: "A Psicanálise, desenvolvida por Sigmund Freud, foca na exploração do inconsciente e como ele influencia nossos pensamentos, sentimentos e comportamentos. Busca compreender conflitos não resolvidos do passado que afetam o presente.",
    benefits: [
      "Autoconhecimento profundo",
      "Compreensão das motivações inconscientes",
      "Resolução de padrões repetitivos de comportamento",
      "Transformação duradoura da personalidade"
    ],
    idealFor: [
      "Transtornos de personalidade", "Questões de identidade", "Trauma profundo", "Relacionamentos disfuncionais", "Angústia existencial"
    ]
  },
  {
    id: "3",
    name: "Terapia Humanista",
    icon: <Sprout className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Centrada na pessoa e no desenvolvimento do potencial humano.",
    description: "A Terapia Humanista enfatiza o potencial humano para o crescimento e a auto-realização. Foca na experiência presente da pessoa, em sua capacidade inata para o crescimento e em sua liberdade de escolha.",
    benefits: [
      "Desenvolvimento de autenticidade",
      "Melhora na autoestima e autoaceitação",
      "Ambiente terapêutico acolhedor e não-julgador",
      "Fortalecimento da autonomia e responsabilidade pessoal"
    ],
    idealFor: [
      "Baixa autoestima", "Crise existencial", "Busca por significado", "Crescimento pessoal", "Dificuldades de autoexpressão"
    ]
  },
  {
    id: "4",
    name: "Terapia Sistêmica",
    icon: <Users className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Aborda problemas no contexto das relações e sistemas familiares.",
    description: "A Terapia Sistêmica vê os problemas como manifestações de padrões disfuncionais nos sistemas aos quais pertencemos, especialmente a família. Foca nas interações entre as pessoas e como elas se influenciam mutuamente.",
    benefits: [
      "Melhoria na comunicação familiar",
      "Identificação de padrões relacionais prejudiciais",
      "Fortalecimento das relações saudáveis",
      "Resolução de conflitos interpessoais"
    ],
    idealFor: [
      "Conflitos familiares", "Problemas conjugais", "Dificuldades parentais", "Crianças e adolescentes", "Transições familiares"
    ]
  },
  {
    id: "5",
    name: "Mindfulness",
    icon: <Smile className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Práticas de atenção plena para redução de estresse e ansiedade.",
    description: "Mindfulness envolve prestar atenção completa ao momento presente, sem julgamento. Integra práticas meditativas com abordagens terapêuticas para promover consciência, aceitação e bem-estar.",
    benefits: [
      "Redução de estresse e ansiedade",
      "Melhora na concentração e atenção",
      "Desenvolvimento de regulação emocional",
      "Maior consciência corporal e mental"
    ],
    idealFor: [
      "Estresse crônico", "Ansiedade", "Prevenção de recaída em depressão", "Dor crônica", "Transtornos alimentares"
    ]
  },
  {
    id: "6",
    name: "Arteterapia",
    icon: <Paintbrush className="h-6 w-6 text-lavender-400" />,
    shortDescription: "Utiliza a expressão artística como meio terapêutico.",
    description: "A Arteterapia utiliza o processo criativo artístico como meio terapêutico, permitindo a expressão de sentimentos e pensamentos que podem ser difíceis de verbalizar. Não é necessário ter habilidades artísticas prévias.",
    benefits: [
      "Expressão não-verbal de emoções complexas",
      "Acesso a conteúdos inconscientes",
      "Desenvolvimento da criatividade e autoexpressão",
      "Redução de estresse e ansiedade"
    ],
    idealFor: [
      "Trauma", "Transtornos emocionais", "Crianças e adolescentes", "Idosos", "Pessoas com dificuldade de expressão verbal"
    ]
  }
];

const Therapies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTherapies, setFilteredTherapies] = useState(therapyTypes);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const results = therapyTypes.filter(therapy => 
      therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.idealFor.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (activeTab !== "all") {
      setFilteredTherapies(results.filter(therapy => therapy.id === activeTab));
    } else {
      setFilteredTherapies(results);
    }
  }, [searchTerm, activeTab]);

  return (
    <div className="min-h-screen bg-teal-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-24 mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Nossas </span>
              <span className="text-lavender-400">terapias</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Conheça as abordagens terapêuticas disponíveis em nossa plataforma e descubra qual pode ser mais adequada para suas necessidades.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <Input
                placeholder="Buscar por nome ou condição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md bg-teal-800/50 border-lavender-400/30 text-white placeholder:text-white/50"
              />
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="border-lavender-400/50 hover:bg-lavender-400/20"
              >
                Limpar busca
              </Button>
            </div>
            
            {/* Tabs for filtering */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex flex-wrap bg-teal-800/30 border border-lavender-400/20">
                <TabsTrigger
                  value="all"
                  className="flex-1 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900"
                >
                  Todas
                </TabsTrigger>
                {therapyTypes.map(therapy => (
                  <TabsTrigger
                    key={therapy.id}
                    value={therapy.id}
                    className="flex-1 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900"
                  >
                    {therapy.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Display therapy types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTherapies.length > 0 ? (
              filteredTherapies.map((therapy) => (
                <Card 
                  key={therapy.id} 
                  className="bg-teal-800/40 hover:bg-teal-800/50 border-lavender-400/20 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-teal-700/50 p-3 rounded-full">
                        {therapy.icon}
                      </div>
                      <h3 className="text-xl font-medium text-white">{therapy.name}</h3>
                    </div>
                    
                    <p className="text-white/80 mb-6">{therapy.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-lavender-300 mb-2">Benefícios</h4>
                      <ul className="list-disc list-inside text-white/80 space-y-1 pl-2">
                        {therapy.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-lavender-300 mb-2">Ideal para</h4>
                      <div className="flex flex-wrap gap-2">
                        {therapy.idealFor.map((condition, index) => (
                          <span 
                            key={index} 
                            className="text-sm bg-teal-700/50 px-3 py-1 rounded-full border border-lavender-400/30"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-teal-700/50">
                      <Link to={`/assessment/start`}>
                        <Button className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                          Fazer avaliação para esta terapia
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-teal-800/20 rounded-lg">
                <p className="text-lg text-white/70">Nenhuma terapia encontrada com os critérios de busca.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}
                  variant="link" 
                  className="text-lavender-400 hover:text-lavender-300 mt-2"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-teal-800/50 to-lavender-500/20 p-8 rounded-xl border border-lavender-400/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Não sabe qual terapia escolher?</h2>
              <p className="text-lg text-white/80 mb-6 max-w-3xl mx-auto">
                Nossos especialistas podem ajudar a encontrar a abordagem mais adequada para você.
                Faça uma avaliação gratuita e receba uma recomendação personalizada.
              </p>
              <Link to="/assessment/start">
                <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 px-8 py-6 text-lg">
                  Fazer avaliação gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Therapies;
