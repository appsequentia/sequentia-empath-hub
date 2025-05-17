
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Sample questions data - in a real app this would come from an API or database
const questions = [
  {
    id: 1,
    question: "Como você classificaria seu nível de ansiedade nos últimos 30 dias?",
    options: [
      { value: "1", label: "Nenhuma ansiedade" },
      { value: "2", label: "Ansiedade leve" },
      { value: "3", label: "Ansiedade moderada" },
      { value: "4", label: "Ansiedade alta" },
      { value: "5", label: "Ansiedade extrema" }
    ]
  },
  {
    id: 2,
    question: "Com que frequência você tem se sentido para baixo, deprimido(a) ou sem esperança?",
    options: [
      { value: "1", label: "Nunca" },
      { value: "2", label: "Raramente" },
      { value: "3", label: "Algumas vezes" },
      { value: "4", label: "Frequentemente" },
      { value: "5", label: "Todos os dias" }
    ]
  },
  {
    id: 3,
    question: "Você tem dificuldade para adormecer ou continuar dormindo, ou dorme demais?",
    options: [
      { value: "1", label: "Nenhuma dificuldade" },
      { value: "2", label: "Leve dificuldade" },
      { value: "3", label: "Dificuldade moderada" },
      { value: "4", label: "Dificuldade significativa" },
      { value: "5", label: "Extrema dificuldade" }
    ]
  },
  {
    id: 4,
    question: "Qual seu nível de interesse ou prazer em fazer as coisas que normalmente gosta?",
    options: [
      { value: "1", label: "Interesse normal" },
      { value: "2", label: "Ligeira perda de interesse" },
      { value: "3", label: "Perda moderada de interesse" },
      { value: "4", label: "Perda significativa de interesse" },
      { value: "5", label: "Nenhum interesse" }
    ]
  },
  {
    id: 5,
    question: "Como você lidaria com uma situação emocional desafiadora?",
    options: [
      { value: "1", label: "Falar com amigos ou familiares" },
      { value: "2", label: "Dedicar-me a um hobby ou atividade física" },
      { value: "3", label: "Praticar meditação ou mindfulness" },
      { value: "4", label: "Buscar ajuda profissional" },
      { value: "5", label: "Tentar ignorar o problema" }
    ]
  }
];

const AssessmentQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const currentId = parseInt(questionId || "1");
  
  const currentQuestion = questions.find(q => q.id === currentId) || questions[0];
  const totalQuestions = questions.length;
  const progress = (currentId / totalQuestions) * 100;
  
  const [selectedOption, setSelectedOption] = useState<string>("");
  
  const handleNext = () => {
    // In a real app, we would save the answer here
    // For demo purposes, we're just simulating the flow
    
    if (currentId < totalQuestions) {
      navigate(`/assessment/questions/${currentId + 1}`);
      setSelectedOption("");
    } else {
      // When all questions are answered, go to results
      navigate("/assessment/results");
    }
  };
  
  const handlePrevious = () => {
    if (currentId > 1) {
      navigate(`/assessment/questions/${currentId - 1}`);
      setSelectedOption("");
    } else {
      navigate("/assessment/start");
    }
  };

  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm">Questão {currentId} de {totalQuestions}</span>
              <span className="text-lavender-300 text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-teal-800" indicatorClassName="bg-lavender-400" />
          </div>
          
          <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
            <CardContent className="p-8">
              <h2 className="text-xl md:text-2xl font-medium text-white mb-6">
                {currentQuestion.question}
              </h2>
              
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`option-${option.value}`} 
                      className="border-lavender-400 text-lavender-400"
                    />
                    <Label 
                      htmlFor={`option-${option.value}`}
                      className="text-white cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  className="text-white hover:bg-lavender-400/20"
                >
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="bg-lavender-400 hover:bg-lavender-500 text-teal-900"
                >
                  {currentId < totalQuestions ? "Próxima" : "Ver resultados"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentQuestion;
