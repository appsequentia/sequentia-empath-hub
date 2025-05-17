import { CheckCircle } from "lucide-react";
export function HowItWorks() {
  const steps = [{
    number: "01",
    title: "Avaliação inteligente",
    description: "Responda um questionário que ajuda a identificar suas necessidades emocionais.",
    benefits: ["Avaliação personalizada", "Perguntas baseadas em metodologias comprovadas", "Totalmente confidencial"]
  }, {
    number: "02",
    title: "Recomendação especializada",
    description: "Receba sugestões de terapias e terapeutas alinhados com seu perfil emocional.",
    benefits: ["Combinação inteligente", "Terapeutas verificados", "Diversas abordagens terapêuticas"]
  }, {
    number: "03",
    title: "Agendamento facilitado",
    description: "Escolha horários disponíveis e agende sessões diretamente com o terapeuta selecionado.",
    benefits: ["Visualização em tempo real", "Confirmação instantânea", "Lembretes automáticos"]
  }];
  return <section className="py-16 md:py-24 relative bg-gray-200">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-lavender-400/10 rounded-bl-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Como <span className="text-lavender-400">funciona</span>
          </h2>
          <p className="mt-4 text-white/80">
            Um processo simples e eficaz para conectar você ao terapeuta ideal
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {steps.map((step, index) => <div key={step.number} className="backdrop-blur-sm rounded-xl p-6 border border-lavender-400/20 relative bg-sky-950">
              <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-lavender-400 flex items-center justify-center text-teal-900 font-bold text-xl">
                {step.number}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">{step.title}</h3>
              <p className="text-white/70 mb-6">{step.description}</p>
              
              <ul className="space-y-2">
                {step.benefits.map((benefit, i) => <li key={i} className="flex items-start">
                    <CheckCircle className="text-lavender-300 mr-2 h-5 w-5 mt-0.5" />
                    <span className="text-white/90 text-sm">{benefit}</span>
                  </li>)}
              </ul>
            </div>)}
        </div>
      </div>
    </section>;
}