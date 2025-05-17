import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

// Questions data for the carousel
const previewQuestions = [{
  id: 1,
  question: "Você se sente ansioso(a) com frequência?",
  options: ["Raramente", "Às vezes", "Quase o tempo todo"]
}, {
  id: 2,
  question: "Como tem sido sua qualidade de sono?",
  options: ["Muito bem", "Dificuldades leves", "Sono irregular ou insônia"]
}, {
  id: 3,
  question: "Você sente prazer nas atividades do dia a dia?",
  options: ["Sim, com frequência", "Às vezes", "Não consigo aproveitar nada"]
}, {
  id: 4,
  question: "Como está sua energia emocional?",
  options: ["Boa parte do tempo me sinto disposto(a)", "Oscila entre cansaço e disposição", "Estou quase sempre cansado(a)"]
}];
export function DiagnosticPreviewCarousel() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const totalQuestions = previewQuestions.length;

  // Handle slide change
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  // Set up the carousel API and events
  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);

    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Autoplay functionality
  useEffect(() => {
    if (!api) return;
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => clearInterval(autoplayInterval);
  }, [api]);
  return <Carousel className="w-full" opts={{
    loop: true
  }} setApi={setApi}>
      <CarouselContent>
        {previewQuestions.map(item => <CarouselItem key={item.id}>
            <div className="relative bg-teal-800/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-auto text-xs text-white/70">Sequentia Diagnóstico</div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-teal-700/50 p-4 rounded-lg">
                  <p className="text-white/90">{item.question}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.options.map((option, index) => <div key={index} className={index === 1 ? "bg-lavender-400 text-teal-900 px-3 py-1 rounded-full text-sm" : "bg-lavender-400/20 text-white px-3 py-1 rounded-full text-sm"}>
                        {option}
                      </div>)}
                  </div>
                </div>
                <div className="bg-teal-700/30 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Progresso</span>
                    <span className="text-xs text-lavender-300">
                      {current + 1} de {totalQuestions}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Progress value={(current + 1) / totalQuestions * 100} className="h-2 bg-teal-700/50" />
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>)}
      </CarouselContent>
      
      
    </Carousel>;
}