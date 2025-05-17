
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star } from "lucide-react";

// Sample data for therapist recommendations
const recommendedTherapists = [
  {
    id: "1",
    name: "Dra. Sofia Mendes",
    specialty: "Psicologia Cognitiva",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviews: 124,
    price: 150,
    matchScore: 95,
    approach: "Terapia Cognitivo-Comportamental"
  },
  {
    id: "3",
    name: "Dra. Camila Santos",
    specialty: "Terapia Sistêmica",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
    rating: 4.7,
    reviews: 87,
    price: 160,
    matchScore: 88,
    approach: "Terapia Sistêmica"
  },
  {
    id: "2",
    name: "Dr. Rafael Costa",
    specialty: "Psicanálise",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviews: 98,
    price: 180,
    matchScore: 82,
    approach: "Psicanálise"
  },
];

// Sample data for therapy recommendations
const recommendedTherapies = [
  {
    name: "Terapia Cognitivo-Comportamental",
    score: 94,
    description: "Ideal para pessoas com ansiedade e padrões de pensamento negativos. Esta abordagem foca na identificação e mudança de pensamentos e comportamentos prejudiciais."
  },
  {
    name: "Terapia de Mindfulness",
    score: 82,
    description: "Recomendada para gerenciamento de estresse e ansiedade. Esta abordagem utiliza técnicas de atenção plena para ajudar a viver o momento presente com aceitação."
  },
  {
    name: "Terapia Sistêmica",
    score: 78,
    description: "Adequada para questões relacionais e familiares. Esta abordagem analisa o indivíduo como parte de sistemas sociais e familiares mais amplos."
  }
];

// Sample emotional assessment results
const assessmentResults = {
  anxietyLevel: "Moderado",
  depressionLevel: "Leve",
  stressLevel: "Elevado",
  sleepQuality: "Comprometida",
  summary: "Seus resultados indicam níveis moderados de ansiedade, com alguns sintomas leves de depressão e níveis elevados de estresse. Sua qualidade de sono está sendo afetada, o que pode estar contribuindo para as suas dificuldades emocionais atuais."
};

const AssessmentResults = () => {
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
          
          <Tabs defaultValue="therapists" className="space-y-6">
            <TabsList className="bg-teal-800/40 border-b border-lavender-400/20 p-0 h-auto mx-auto w-full md:w-auto">
              <TabsTrigger 
                value="therapists" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Terapeutas Recomendados
              </TabsTrigger>
              <TabsTrigger 
                value="therapies" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Abordagens Terapêuticas
              </TabsTrigger>
              <TabsTrigger 
                value="assessment" 
                className="py-3 px-6 data-[state=active]:bg-lavender-400 data-[state=active]:text-teal-900 rounded-none"
              >
                Avaliação Detalhada
              </TabsTrigger>
            </TabsList>
            
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
                            <span className="text-lavender-300 font-medium text-sm">{therapist.matchScore}% match</span>
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
                              Abordagem: <span className="text-white">{therapist.approach}</span>
                            </p>
                            <div className="bg-teal-700/40 mt-3 p-4 rounded-md border border-lavender-400/10">
                              <p className="text-white/90 text-sm">
                                Este especialista foi recomendado com base no seu perfil emocional, especialmente 
                                considerando seus níveis de ansiedade e padrões de pensamento identificados na avaliação.
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
            
            {/* Therapies Tab */}
            <TabsContent value="therapies" className="mt-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <p className="text-white/80">
                      Com base nas suas respostas, estas são as abordagens terapêuticas mais adequadas para você:
                    </p>
                    
                    {recommendedTherapies.map((therapy, index) => (
                      <div key={index} className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">{therapy.name}</h3>
                          <span className="text-lavender-300 font-medium">{therapy.score}% match</span>
                        </div>
                        <p className="mt-2 text-white/80 text-sm">{therapy.description}</p>
                      </div>
                    ))}
                    
                    <div className="bg-lavender-400/10 p-4 rounded-md border border-lavender-400/20 mt-6">
                      <h3 className="text-lg font-medium text-white">Próximos passos</h3>
                      <p className="mt-2 text-white/80 text-sm">
                        Estas abordagens terapêuticas são complementares e podem ser combinadas. Recomendamos iniciar com a abordagem de maior compatibilidade, mas a decisão final deve ser tomada em conjunto com o terapeuta escolhido.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Assessment Tab */}
            <TabsContent value="assessment" className="mt-6">
              <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <p className="text-white/80">
                      Aqui está um resumo da sua avaliação emocional:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                        <h3 className="text-white/80 text-sm mb-1">Nível de Ansiedade</h3>
                        <p className="text-white text-lg font-medium">{assessmentResults.anxietyLevel}</p>
                      </div>
                      
                      <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                        <h3 className="text-white/80 text-sm mb-1">Nível de Depressão</h3>
                        <p className="text-white text-lg font-medium">{assessmentResults.depressionLevel}</p>
                      </div>
                      
                      <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                        <h3 className="text-white/80 text-sm mb-1">Nível de Estresse</h3>
                        <p className="text-white text-lg font-medium">{assessmentResults.stressLevel}</p>
                      </div>
                      
                      <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                        <h3 className="text-white/80 text-sm mb-1">Qualidade do Sono</h3>
                        <p className="text-white text-lg font-medium">{assessmentResults.sleepQuality}</p>
                      </div>
                    </div>
                    
                    <div className="bg-lavender-400/10 p-4 rounded-md border border-lavender-400/20">
                      <h3 className="text-lg font-medium text-white">Resumo</h3>
                      <p className="mt-2 text-white/80 text-sm">{assessmentResults.summary}</p>
                    </div>
                    
                    <div className="bg-teal-700/40 p-4 rounded-md border border-lavender-400/10">
                      <h3 className="text-lg font-medium text-white">Observação</h3>
                      <p className="mt-2 text-white/80 text-sm">
                        Esta avaliação é apenas um indicativo e não substitui um diagnóstico profissional completo. 
                        Para um diagnóstico preciso e tratamento adequado, recomendamos consultar um dos especialistas indicados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-center">
            <Link to="/signup-client">
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
