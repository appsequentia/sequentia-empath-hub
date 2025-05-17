
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BadgePercent, CreditCard, Package } from "lucide-react";

export function SessionPackages() {
  const packages = [
    {
      id: "single",
      title: "Pacote Avulso",
      icon: <CreditCard className="h-10 w-10 text-lavender-400" />,
      price: "R$150",
      description: "1 sessão individual. Ideal para conhecer o serviço.",
      benefits: ["Sem compromisso", "Conheça seu terapeuta", "Experiência completa"],
      buttonText: "Adquirir pacote",
      highlight: false
    },
    {
      id: "essential",
      title: "Pacote Essencial",
      icon: <Package className="h-10 w-10 text-lavender-400" />,
      price: "R$420",
      description: "3 sessões com desconto (R$140 cada).",
      benefits: ["Economize R$30", "Continuidade no tratamento", "Melhor aproveitamento"],
      buttonText: "Adquirir pacote",
      highlight: true
    },
    {
      id: "intensive",
      title: "Pacote Intensivo",
      icon: <BadgePercent className="h-10 w-10 text-lavender-400" />,
      price: "R$650",
      description: "5 sessões com desconto (R$130 cada).",
      benefits: ["Economize R$100", "Acompanhamento completo", "Maior progresso terapêutico"],
      buttonText: "Adquirir pacote",
      highlight: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-teal-800/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Pacotes de <span className="text-lavender-400">Sessões</span>
          </h2>
          <p className="mt-4 text-white/80">
            Escolha o pacote ideal para sua jornada terapêutica
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`bg-teal-700/40 backdrop-blur-sm border-lavender-400/20 transition-all duration-300 h-full hover:translate-y-[-4px] ${
                pkg.highlight ? "border-lavender-400" : ""
              }`}
            >
              <CardHeader className="pb-0 pt-6">
                <div className="flex justify-center mb-4">{pkg.icon}</div>
                <h3 className="text-xl font-semibold text-white text-center">{pkg.title}</h3>
                <div className="text-2xl font-bold text-lavender-300 text-center mt-2">
                  {pkg.price}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-white/90 text-center mb-6">{pkg.description}</p>
                <ul className="space-y-3">
                  {pkg.benefits.map((benefit, index) => (
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
                  {pkg.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
