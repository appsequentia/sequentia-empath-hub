
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const AssessmentStart = () => {
  // Limpar dados anteriores de avaliação quando iniciar um novo teste
  useEffect(() => {
    sessionStorage.removeItem("assessmentAnswers");
    sessionStorage.removeItem("assessmentScore");
  }, []);

  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Avaliação <span className="text-lavender-400">Emocional</span>
            </h1>
            <p className="mt-4 text-white/80">
              Responda 8 perguntas para ajudarmos a identificar a melhor abordagem terapêutica para você
            </p>
          </div>
          
          <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="bg-teal-700/40 p-4 rounded-lg border border-lavender-400/20">
                  <h3 className="text-lg font-medium text-white mb-2">Como funciona</h3>
                  <p className="text-white/80 text-sm">
                    Este questionário contém 8 perguntas sobre seu bem-estar emocional,
                    incluindo padrões de sono, energia, níveis de ansiedade e relacionamentos.
                    Leva aproximadamente 3 minutos para completar.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">O que você vai receber</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-lavender-400 mr-2">•</span>
                      <span className="text-white/80 text-sm">Avaliação personalizada do seu estado emocional atual</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lavender-400 mr-2">•</span>
                      <span className="text-white/80 text-sm">Recomendações de abordagens terapêuticas adequadas para seu perfil</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-lavender-400 mr-2">•</span>
                      <span className="text-white/80 text-sm">Sugestões de terapeutas especializados nas áreas que você mais precisa</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-lavender-400/10 p-4 rounded-lg border border-lavender-400/20">
                  <h3 className="text-lg font-medium text-white mb-2">Privacidade</h3>
                  <p className="text-white/80 text-sm">
                    Suas respostas são confidenciais e protegidas. Utilizamos os dados apenas para 
                    criar recomendações personalizadas e ajudá-lo a encontrar o melhor suporte emocional.
                  </p>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <Link to="/">
                    <Button variant="ghost" className="text-white hover:bg-lavender-400/20">
                      Voltar
                    </Button>
                  </Link>
                  <Link to="/assessment/questions/1">
                    <Button className="bg-lavender-400 hover:bg-lavender-500 text-teal-900 px-8">
                      Iniciar avaliação
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentStart;
