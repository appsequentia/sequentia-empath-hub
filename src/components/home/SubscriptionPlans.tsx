
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarCheck, CalendarRange } from "lucide-react";

export function SubscriptionPlans() {
  const plans = [
    {
      id: "monthly",
      title: "Plano Mensal",
      icon: <Calendar className="h-10 w-10 text-lavender-400" />,
      price: "R$180",
      period: "/mês",
      description: "Renova automaticamente todo mês",
      benefits: [
        "Ideal para quem deseja uma sessão mensal",
        "Cancelamento a qualquer momento"
      ],
      buttonText: "Assinar agora",
      popular: false
    },
    {
      id: "semiannual",
      title: "Plano Semestral",
      icon: <CalendarCheck className="h-10 w-10 text-lavender-400" />,
      price: "R$960",
      period: " (6x R$160)",
      description: "6 meses de assinatura com economia",
      benefits: [
        "Mais sessões por um valor reduzido",
        "Fidelidade de 6 meses",
        "Agende com antecedência"
      ],
      buttonText: "Assinar agora",
      popular: true
    },
    {
      id: "annual",
      title: "Plano Anual",
      icon: <CalendarRange className="h-10 w-10 text-lavender-400" />,
      price: "R$1.800",
      period: " (12x R$150)",
      description: "Valor mais econômico por sessão",
      benefits: [
        "Sessões ao longo de todo o ano",
        "Fidelidade de 12 meses",
        "Maior economia a longo prazo"
      ],
      buttonText: "Assinar agora",
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Assine um plano de <span className="text-lavender-400">acompanhamento</span>
          </h2>
          <p className="mt-4 text-white/80">
            Escolha o plano ideal para o seu processo terapêutico contínuo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`bg-teal-700/40 backdrop-blur-sm border-lavender-400/20 transition-all duration-300 h-full hover:translate-y-[-4px] relative ${
                plan.popular ? "border-lavender-400" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-lavender-400 text-teal-900 font-medium">
                  Mais popular
                </Badge>
              )}
              <CardHeader className="pb-0 pt-6">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <h3 className="text-xl font-semibold text-white text-center">{plan.title}</h3>
                <div className="text-2xl font-bold text-lavender-300 text-center mt-2 flex items-center justify-center gap-1">
                  <span>{plan.price}</span>
                  <span className="text-sm text-lavender-300/70 font-normal">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-white/90 text-center mb-6">{plan.description}</p>
                <ul className="space-y-3">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="bg-lavender-400/30 rounded-full p-1 flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-lavender-300"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-white/80 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-lavender-400 hover:bg-lavender-500 text-teal-900">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
