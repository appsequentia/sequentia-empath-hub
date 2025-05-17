
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Definição das perguntas com opções e pontuação
const questions = [
  {
    id: 1,
    question: "Como você tem dormido nas últimas semanas?",
    options: [
      { value: "0", label: "Muito bem", points: 0 },
      { value: "1", label: "Dificuldades leves", points: 1 },
      { value: "2", label: "Sono irregular ou insônia", points: 2 }
    ]
  },
  {
    id: 2,
    question: "Como está sua energia no dia a dia?",
    options: [
      { value: "0", label: "Boa parte do tempo me sinto disposto(a)", points: 0 },
      { value: "1", label: "Oscila entre cansaço e disposição", points: 1 },
      { value: "2", label: "Estou quase sempre cansado(a)", points: 2 }
    ]
  },
  {
    id: 3,
    question: "Você se sente ansioso(a) com frequência?",
    options: [
      { value: "0", label: "Raramente", points: 0 },
      { value: "1", label: "Às vezes", points: 1 },
      { value: "2", label: "Quase o tempo todo", points: 2 }
    ]
  },
  {
    id: 4,
    question: "Como você tem lidado com suas emoções?",
    options: [
      { value: "0", label: "De forma equilibrada", points: 0 },
      { value: "1", label: "Com alguma dificuldade", points: 1 },
      { value: "2", label: "Tenho me sentido sobrecarregado(a)", points: 2 }
    ]
  },
  {
    id: 5,
    question: "Você sente que tem apoio emocional de outras pessoas?",
    options: [
      { value: "0", label: "Sim, me sinto apoiado(a)", points: 0 },
      { value: "1", label: "Às vezes", points: 1 },
      { value: "2", label: "Me sinto sozinho(a)", points: 2 }
    ]
  },
  {
    id: 6,
    question: "Como estão seus relacionamentos?",
    options: [
      { value: "0", label: "Saudáveis", points: 0 },
      { value: "1", label: "Algumas tensões", points: 1 },
      { value: "2", label: "Muitas dificuldades", points: 2 }
    ]
  },
  {
    id: 7,
    question: "Você sente prazer nas atividades do dia a dia?",
    options: [
      { value: "0", label: "Sim, com frequência", points: 0 },
      { value: "1", label: "Às vezes", points: 1 },
      { value: "2", label: "Não consigo aproveitar nada", points: 2 }
    ]
  },
  {
    id: 8,
    question: "Você sente que sua saúde mental precisa de atenção?",
    options: [
      { value: "0", label: "Não, me sinto bem", points: 0 },
      { value: "1", label: "Talvez precise de ajuda", points: 1 },
      { value: "2", label: "Sim, estou buscando apoio", points: 2 }
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
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    // Recuperar respostas armazenadas no sessionStorage, se existirem
    const savedAnswers = sessionStorage.getItem("assessmentAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  
  // Preencher a opção selecionada se já houver uma resposta para essa pergunta
  useEffect(() => {
    if (answers[currentId] !== undefined) {
      setSelectedOption(answers[currentId].toString());
    } else {
      setSelectedOption("");
    }
  }, [currentId, answers]);
  
  const handleAnswer = (value: string) => {
    const option = currentQuestion.options.find(opt => opt.value === value);
    if (option) {
      const points = option.points;
      const updatedAnswers = { ...answers, [currentId]: points };
      setAnswers(updatedAnswers);
      sessionStorage.setItem("assessmentAnswers", JSON.stringify(updatedAnswers));
    }
    setSelectedOption(value);
  };
  
  const handleNext = () => {
    if (currentId < totalQuestions) {
      navigate(`/assessment/questions/${currentId + 1}`);
    } else {
      // Calcular pontuação total
      const totalScore = Object.values(answers).reduce((sum, points) => sum + points, 0);
      sessionStorage.setItem("assessmentScore", totalScore.toString());
      
      // Redirecionar para a página de resultados
      navigate("/assessment/results");
    }
  };
  
  const handlePrevious = () => {
    if (currentId > 1) {
      navigate(`/assessment/questions/${currentId - 1}`);
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
            <Progress value={progress} className="h-2 bg-teal-800" />
          </div>
          
          <Card className="bg-teal-800/40 backdrop-blur-sm border-lavender-400/20">
            <CardContent className="p-8">
              <h2 className="text-xl md:text-2xl font-medium text-white mb-6">
                {currentQuestion.question}
              </h2>
              
              <RadioGroup value={selectedOption} onValueChange={handleAnswer} className="space-y-4">
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
