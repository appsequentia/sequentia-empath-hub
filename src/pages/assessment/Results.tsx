
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star } from "lucide-react";

// Definição das mensagens por faixa de pontuação
const scoreMessages = [
  {
    range: [0, 5],
    title: "Estabilidade Emocional",
    message: "Você parece emocionalmente estável neste momento. Pode explorar terapias de autoconhecimento ou apoio leve.",
    therapies: ["Coaching de Vida", "Mindfulness", "Terapia Breve"]
  },
  {
    range: [6, 10],
    title: "Desafios Emocionais Moderados",
    message: "Você pode estar enfrentando desafios emocionais moderados. Recomendamos acompanhamento terapêutico com abordagem integrativa.",
    therapies: ["Terapia Humanista", "Terapia Sistêmica", "Terapia Cognitivo-Comportamental"]
  },
  {
    range: [11, 16],
    title: "Alta Sobrecarga Emocional",
    message: "Identificamos sinais de alta sobrecarga emocional. Indicamos terapias focadas em ansiedade, estresse ou depressão.",
    therapies: ["Terapia Cognitivo-Comportamental", "Psicanálise", "Terapia Integrativa"]
  }
];

// Dados das abordagens terapêuticas
const therapyApproaches = {
  "Terapia Cognitivo-Comportamental": {
    description: "Foca na identificação e mudança de padrões de pensamentos negativos e comportamentos disfuncionais. Eficaz para ansiedade, depressão e estresse.",
    timeFrame: "Resultados em 12-16 sessões",
    focus: "Pensamentos e comportamentos"
  },
  "Psicanálise": {
    description: "Explora o inconsciente e como experiências passadas influenciam o comportamento atual. Ajuda a compreender padrões emocionais profundos.",
    timeFrame: "Terapia de longo prazo",
    focus: "Inconsciente e experiências passadas"
  },
  "Terapia Humanista": {
    description: "Centralizada no potencial de crescimento pessoal, autoconhecimento e aceitação. Incentiva a expressão autêntica e autonomia.",
    timeFrame: "Resultados em 6 meses a 1 ano",
    focus: "Autoconhecimento e potencial humano"
  },
  "Terapia Sistêmica": {
    description: "Analisa como os sistemas familiares e sociais afetam o indivíduo. Ideal para questões relacionais e familiares.",
    timeFrame: "Resultados em 4-6 meses",
    focus: "Dinâmicas relacionais"
  },
  "Mindfulness": {
    description: "Integra técnicas de meditação e atenção plena para reduzir estresse e ansiedade, promovendo bem-estar emocional.",
    timeFrame: "Benefícios em 8 semanas",
    focus: "Atenção plena e momento presente"
  },
  "Terapia Breve": {
    description: "Abordagem focada e de curta duração para questões específicas, com objetivos claros e prazo definido.",
    timeFrame: "5-10 sessões",
    focus: "Soluções e resultados rápidos"
  },
  "Coaching de Vida": {
    description: "Foca no desenvolvimento pessoal e alcance de objetivos específicos, promovendo autoconhecimento e crescimento.",
    timeFrame: "3-6 meses",
    focus: "Metas e autodesenvolvimento"
  },
  "Terapia Integrativa": {
    description: "Combina diferentes abordagens terapêuticas de acordo com as necessidades individuais do paciente.",
    timeFrame: "Personalizado",
    focus: "Integração de múltiplas técnicas"
  }
};

// Lista completa de terapeutas
const allTherapists = [
  {
    id: "1",
    name: "Dra. Sofia Mendes",
    specialty: "Terapia Cognitivo-Comportamental",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviews: 124,
    price: 150,
    focus: ["Ansiedade", "Depressão", "Estresse"]
  },
  {
    id: "2",
    name: "Dr. Rafael Costa",
    specialty: "Psicanálise",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviews: 98,
    price: 180,
    focus: ["Traumas", "Autoconhecimento", "Relações interpessoais"]
  },
  {
    id: "3",
    name: "Dra. Camila Santos",
    specialty: "Terapia Sistêmica",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
    rating: 4.7,
    reviews: 87,
    price: 160,
    focus: ["Relacionamentos", "Família", "Comunicação"]
  },
  {
    id: "4",
    name: "Dr. André Oliveira",
    specialty: "Terapia Humanista",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviews: 112,
    price: 170,
    focus: ["Autoestima", "Propósito de vida", "Desenvolvimento pessoal"]
  },
  {
    id: "5",
    name: "Dra. Luiza Ferreira",
    specialty: "Terapia Integrativa",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviews: 91,
    price: 190,
    focus: ["Estresse crônico", "Burnout", "Equilíbrio emocional"]
  },
  {
    id: "6",
    name: "Dr. Marcos Pereira",
    specialty: "Mindfulness",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.6,
    reviews: 76,
    price: 140,
    focus: ["Ansiedade", "Atenção plena", "Qualidade de vida"]
  }
];

const AssessmentResults = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState<number | null>(null);
  const [messageData, setMessageData] = useState<typeof scoreMessages[0] | null>(null);
  const [recommendedTherapists, setRecommendedTherapists] = useState<typeof allTherapists>([]);
  
  useEffect(() => {
    // Recuperar pontuação do sessionStorage
    const storedScore = sessionStorage.getItem("assessmentScore");
    
    if (!storedScore) {
      // Se não houver pontuação, redirecionar para o início da avaliação
      navigate("/assessment/start");
      return;
    }
    
    const parsedScore = parseInt(storedScore);
    setScore(parsedScore);
    
    // Encontrar a faixa de pontuação correspondente
    const matchingMessage = scoreMessages.find(
      item => parsedScore >= item.range[0] && parsedScore <= item.range[1]
    );
    
    if (matchingMessage) {
      setMessageData(matchingMessage);
      
      // Filtrar terapeutas com base nas terapias recomendadas
      const filteredTherapists = allTherapists.filter(therapist => 
        matchingMessage.therapies.includes(therapist.specialty)
      );
      
      // Se não houver terapeutas compatíveis com as terapias recomendadas,
      // mostrar os 3 primeiros terapeutas da lista completa
      setRecommendedTherapists(
        filteredTherapists.length > 0 ? 
          filteredTherapists.slice(0, 3) : 
          allTherapists.slice(0, 3)
      );
    }
  }, [navigate]);
  
  // Se a pontuação não estiver disponível, mostrar um carregamento
  if (score === null || messageData === null) {
    return (
      <div className="min-h-screen bg-teal-900 text-white flex items-center justify-center">
        <p>Carregando resultados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Seus <span className="text-lavender-400">Resultados</span>
            </h1>
            <p className="mt-4 text-white/80">
              Com base nas suas respostas, preparamos recomendações personalizadas para você
            </p>
          </div>
          
          {/* Pontuação e Diagnóstico */}
          <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="bg-gradient-to-b from-lavender-400 to-lavender-600 w-32 h-32 rounded-full flex items-center justify-center text-teal-900">
                  <span className="text-4xl font-bold">{score}/16</span>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-white mb-2">{messageData.title}</h2>
                  <p className="text-white/90">{messageData.message}</p>
                  <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10 mt-4">
                    <p className="text-white/90 text-sm">
                      Lembre-se: esta avaliação oferece um panorama inicial da sua saúde emocional,
                      mas não substitui uma consulta com um profissional qualificado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="therapies" className="space-y-6">
            <TabsList className="bg-teal-800/40 border-b border-lavender-400/20 p-0 h-auto mx-auto w-full md:w-auto">
              <TabsTrigger 
                value="therapies" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Abordagens Recomendadas
              </TabsTrigger>
              <TabsTrigger 
                value="therapists" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Terapeutas Compatíveis
              </TabsTrigger>
            </TabsList>
            
            {/* Therapies Tab */}
            <TabsContent value="therapies" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {messageData.therapies.map((therapy) => (
                  <Card 
                    key={therapy} 
                    className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-medium text-white mb-3">{therapy}</h3>
                      <div className="bg-teal-700/40 p-3 rounded-md border border-lavender-400/10 mb-4">
                        <p className="text-white/90 text-sm">{therapyApproaches[therapy]?.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-lavender-300">•</span>
                          <p className="text-white/80 text-sm">
                            <span className="font-medium text-white">Foco:</span> {therapyApproaches[therapy]?.focus}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-lavender-300">•</span>
                          <p className="text-white/80 text-sm">
                            <span className="font-medium text-white">Duração:</span> {therapyApproaches[therapy]?.timeFrame}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Therapists Tab */}
            <TabsContent value="therapists" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {recommendedTherapists.map((therapist) => (
                  <Card 
                    key={therapist.id} 
                    className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <img 
                            src={therapist.avatar} 
                            alt={therapist.name} 
                            className="w-28 h-28 rounded-full object-cover border-2 border-lavender-400"
                          />
                          <div className="mt-3 bg-lavender-400/20 rounded-full px-3 py-1 text-center">
                            <span className="text-lavender-300 font-medium text-sm">Compatível</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-xl font-medium text-white">{therapist.name}</h3>
                              <p className="text-lavender-300">{therapist.specialty}</p>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(therapist.rating) ? 'text-lavender-400 fill-lavender-400' : 'text-gray-400'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-white/90 text-sm">{therapist.rating} ({therapist.reviews})</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-white/80 text-sm">
                              Áreas de foco: 
                              <span className="text-white ml-1">
                                {therapist.focus.join(", ")}
                              </span>
                            </p>
                            <div className="bg-teal-700/40 mt-3 p-4 rounded-md border border-lavender-400/10">
                              <p className="text-white/90 text-sm">
                                Este especialista trabalha com {therapist.specialty}, uma abordagem 
                                recomendada com base no seu perfil emocional atual.
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <span className="text-white font-medium">R$ {therapist.price}/sessão</span>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Link to={`/specialists/${therapist.id}`}>
                                <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
                                  Ver perfil
                                </Button>
                              </Link>
                              <Link to={`/booking/${therapist.id}`}>
                                <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                                  Agendar sessão
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            <Link to="/assessment/start">
              <Button variant="outline" className="bg-transparent border-lavender-400 text-white hover:bg-lavender-500/20">
                Refazer avaliação
              </Button>
            </Link>
            <Link to="/register-cliente">
              <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                Criar conta para salvar resultados
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentResults;
